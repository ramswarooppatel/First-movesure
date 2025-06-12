import { supabaseAdmin } from '@/lib/supabase';
import { AuthUtils } from '@/utils/auth';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ success: false, error: 'Method not allowed' });
  }

  try {
    const authHeader = req.headers.authorization;
    const { search = '', role = 'all', include_assigned = 'false', current_branch = '' } = req.query;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ success: false, error: 'No token provided' });
    }

    const token = authHeader.split(' ')[1];
    const decoded = AuthUtils.verifyToken(token);
    
    if (!decoded) {
      return res.status(401).json({ success: false, error: 'Invalid token' });
    }

    const { userId } = decoded;

    // Get user's company
    const { data: userData, error: userError } = await supabaseAdmin
      .from('users')
      .select('company_id')
      .eq('id', userId)
      .single();

    if (userError || !userData) {
      return res.status(404).json({ success: false, error: 'User not found' });
    }

    // Build query for staff - now includes both assigned and unassigned
    let query = supabaseAdmin
      .from('users')
      .select(`
        id,
        first_name,
        last_name,
        email,
        phone,
        role,
        designation,
        department,
        branch_id,
        is_active,
        created_at,
        branches:branch_id (
          id,
          name,
          is_head_office,
          city,
          state
        )
      `)
      .eq('company_id', userData.company_id)
      .eq('is_active', true);

    // If include_assigned is false, only get unassigned staff
    if (include_assigned === 'false') {
      query = query.is('branch_id', null);
    } else {
      // If current_branch is provided, exclude staff from that branch (for transfers)
      if (current_branch) {
        query = query.neq('branch_id', current_branch);
      }
    }

    // Apply search filter
    if (search && search.trim()) {
      const searchTerm = search.trim();
      query = query.or(`first_name.ilike.%${searchTerm}%,last_name.ilike.%${searchTerm}%,email.ilike.%${searchTerm}%,designation.ilike.%${searchTerm}%`);
    }

    // Apply role filter
    if (role !== 'all') {
      query = query.eq('role', role);
    }

    query = query.order('created_at', { ascending: false });

    const { data: staff, error } = await query;

    if (error) {
      console.error('Error fetching staff:', error);
      return res.status(500).json({ success: false, error: error.message });
    }

    return res.status(200).json({
      success: true,
      data: staff || [],
      total: staff?.length || 0
    });

  } catch (error) {
    console.error('Staff API error:', error);
    return res.status(500).json({ success: false, error: 'Internal server error' });
  }
}