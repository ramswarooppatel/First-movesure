import { supabaseAdmin } from '@/lib/supabase';
import { AuthUtils } from '@/utils/auth';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, error: 'Method not allowed' });
  }

  try {
    const { id: branchId } = req.query;
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

    // Check user permissions (only admins and super_admins can assign staff)
    if (!['super_admin', 'admin', 'branch_manager'].includes(userData.role)) {
      return res.status(403).json({ success: false, error: 'Insufficient permissions' });
    }

    // Verify branch belongs to user's company
    const { data: branchData, error: branchError } = await supabaseAdmin
      .from('branches')
      .select('company_id, name')
      .eq('id', branchId)
      .single();

    if (branchError || !branchData) {
      return res.status(404).json({ success: false, error: 'Branch not found' });
    }

    if (branchData.company_id !== userData.company_id) {
      return res.status(403).json({ success: false, error: 'Access denied' });
    }

    // Validate staffIds array
    if (!staffIds || !Array.isArray(staffIds) || staffIds.length === 0) {
      return res.status(400).json({ success: false, error: 'Staff IDs are required' });
    }

    // Get current staff assignments to track transfers
    const { data: currentStaffData, error: currentStaffError } = await supabaseAdmin
      .from('users')
      .select(`
        id, 
        first_name, 
        last_name, 
        branch_id,
        branches:branch_id (name)
      `)
      .in('id', staffIds)
      .eq('company_id', userData.company_id);

    if (currentStaffError) {
      return res.status(500).json({ success: false, error: 'Failed to verify staff members' });
    }

    if (currentStaffData.length !== staffIds.length) {
      return res.status(400).json({ success: false, error: 'Some staff members not found or access denied' });
    }

    // Track transfers and new assignments
    const transfers = currentStaffData.filter(staff => staff.branch_id && staff.branch_id !== branchId);
    const newAssignments = currentStaffData.filter(staff => !staff.branch_id);

    // Update staff members' branch assignment
    const { data: updatedStaff, error: updateError } = await supabaseAdmin
      .from('users')
      .update({ 
        branch_id: branchId,
        updated_at: new Date().toISOString()
      })
      .in('id', staffIds)
      .select('id, first_name, last_name, role, designation');

    if (updateError) {
      console.error('Error updating staff assignments:', updateError);
      return res.status(500).json({ success: false, error: 'Failed to assign staff to branch' });
    }

    // Prepare response message
    let message = '';
    if (transfers.length > 0 && newAssignments.length > 0) {
      message = `Successfully assigned ${newAssignments.length} new staff member(s) and transferred ${transfers.length} staff member(s) to ${branchData.name}`;
    } else if (transfers.length > 0) {
      message = `Successfully transferred ${transfers.length} staff member(s) to ${branchData.name}`;
    } else {
      message = `Successfully assigned ${newAssignments.length} staff member(s) to ${branchData.name}`;
    }

    return res.status(200).json({
      success: true,
      message,
      data: {
        branch: branchData,
        assignedStaff: updatedStaff,
        transfers: transfers.map(staff => ({
          id: staff.id,
          name: `${staff.first_name} ${staff.last_name}`,
          fromBranch: staff.branches?.name || 'Unknown'
        })),
        newAssignments: newAssignments.map(staff => ({
          id: staff.id,
          name: `${staff.first_name} ${staff.last_name}`
        }))
      }
    });

  } catch (error) {
    console.error('Staff assignment API error:', error);
    return res.status(500).json({ success: false, error: 'Internal server error' });
  }
}