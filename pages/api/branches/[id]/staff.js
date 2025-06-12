import { supabaseAdmin } from '@/lib/supabase';
import { AuthUtils } from '@/utils/auth';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ success: false, error: 'Method not allowed' });
  }

  try {
    const { id: branchId } = req.query;
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
      .select('company_id')
      .eq('id', userId)
      .single();

    if (userError || !userData) {
      return res.status(404).json({ success: false, error: 'User not found' });
    }

    // Verify branch belongs to user's company
    const { data: branchData, error: branchError } = await supabaseAdmin
      .from('branches')
      .select('company_id')
      .eq('id', branchId)
      .single();

    if (branchError || !branchData) {
      return res.status(404).json({ success: false, error: 'Branch not found' });
    }

    if (branchData.company_id !== userData.company_id) {
      return res.status(403).json({ success: false, error: 'Access denied' });
    }

    // Fetch staff data for the branch
    const { data, error } = await supabaseAdmin
      .from('users')
      .select(`
        id,
        first_name,
        last_name,
        email,
        role,
        designation,
        is_active,
        joining_date,
        created_at
      `)
      .eq('branch_id', branchId)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching staff details:', error);
      return res.status(500).json({ success: false, error: error.message });
    }

    // Calculate stats
    const totalStaff = data?.length || 0;
    const activeStaff = data?.filter(staff => staff.is_active)?.length || 0;
    const inactiveStaff = totalStaff - activeStaff;
    
    const roleStats = {
      super_admin: data?.filter(staff => staff.role === 'super_admin')?.length || 0,
      admin: data?.filter(staff => staff.role === 'admin')?.length || 0,
      branch_manager: data?.filter(staff => staff.role === 'branch_manager')?.length || 0,
      branch_staff: data?.filter(staff => staff.role === 'branch_staff')?.length || 0,
      viewer: data?.filter(staff => staff.role === 'viewer')?.length || 0
    };

    return res.status(200).json({
      success: true,
      data: data || [],
      stats: {
        total: totalStaff,
        active: activeStaff,
        inactive: inactiveStaff,
        roles: roleStats
      }
    });

  } catch (error) {
    console.error('Staff details API error:', error);
    return res.status(500).json({ success: false, error: 'Internal server error' });
  }
}