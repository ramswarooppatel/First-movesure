import { supabaseAdmin } from '@/lib/supabase';
import { AuthUtils } from '@/utils/auth';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, error: 'Method not allowed' });
  }

  try {
    const { staffIds } = req.body;
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ success: false, error: 'No token provided' });
    }

    const token = authHeader.split(' ')[1];
    const decoded = AuthUtils.verifyToken(token);
    
    if (!decoded) {
      return res.status(401).json({ success: false, error: 'Invalid token' });
    }

    const { userId } = decoded;

    // Get user's company to verify access
    const { data: userData, error: userError } = await supabaseAdmin
      .from('users')
      .select('company_id, role')
      .eq('id', userId)
      .single();

    if (userError || !userData) {
      return res.status(404).json({ success: false, error: 'User not found' });
    }

    // Check user permissions
    if (!['super_admin', 'admin', 'branch_manager'].includes(userData.role)) {
      return res.status(403).json({ success: false, error: 'Insufficient permissions' });
    }

    // Validate staffIds array
    if (!staffIds || !Array.isArray(staffIds) || staffIds.length === 0) {
      return res.status(400).json({ success: false, error: 'Staff IDs are required' });
    }

    // Verify all staff members belong to the same company
    const { data: staffMembers, error: staffError } = await supabaseAdmin
      .from('users')
      .select('id, first_name, last_name, branch_id')
      .in('id', staffIds)
      .eq('company_id', userData.company_id);

    if (staffError) {
      return res.status(500).json({ success: false, error: 'Failed to verify staff members' });
    }

    if (staffMembers.length !== staffIds.length) {
      return res.status(400).json({ success: false, error: 'Some staff members not found or access denied' });
    }

    // Remove staff members from branch (set branch_id to null)
    const { data: unassignedStaff, error: updateError } = await supabaseAdmin
      .from('users')
      .update({ 
        branch_id: null,
        updated_at: new Date().toISOString()
      })
      .in('id', staffIds)
      .select('id, first_name, last_name');

    if (updateError) {
      console.error('Error unassigning staff from branch:', updateError);
      return res.status(500).json({ success: false, error: 'Failed to remove staff from branch' });
    }

    return res.status(200).json({
      success: true,
      message: `Successfully removed ${unassignedStaff.length} staff member(s) from branch`,
      data: {
        unassignedStaff
      }
    });

  } catch (error) {
    console.error('Staff unassignment API error:', error);
    return res.status(500).json({ success: false, error: 'Internal server error' });
  }
}