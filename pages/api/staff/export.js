import { supabaseAdmin } from '@/lib/supabase';
import { AuthUtils } from '@/utils/auth';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ success: false, error: 'Method not allowed' });
  }

  try {
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

    // Get user's company
    const { data: userData, error: userError } = await supabaseAdmin
      .from('users')
      .select('company_id')
      .eq('id', userId)
      .single();

    if (userError || !userData) {
      return res.status(404).json({ success: false, error: 'User not found' });
    }

    const {
      branch = '',
      role = '',
      status = 'all',
      department = ''
    } = req.query;

    let query = supabaseAdmin
      .from('users')
      .select(`
        first_name,
        last_name,
        email,
        phone,
        designation,
        department,
        role,
        is_active,
        joining_date,
        city,
        state,
        branches:branch_id (name)
      `)
      .eq('company_id', userData.company_id);

    // Apply filters
    if (branch) {
      query = query.eq('branch_id', branch);
    }

    if (role) {
      query = query.eq('role', role);
    }

    if (status !== 'all') {
      query = query.eq('is_active', status === 'active');
    }

    if (department) {
      query = query.ilike('department', `%${department}%`);
    }

    query = query.order('first_name', { ascending: true });

    const { data, error } = await query;

    if (error) {
      throw error;
    }

    // Generate CSV
    const headers = [
      'First Name',
      'Last Name', 
      'Email',
      'Phone',
      'Designation',
      'Department',
      'Role',
      'Branch',
      'Status',
      'Joining Date',
      'City',
      'State'
    ];

    const csvRows = [
      headers.join(','),
      ...data.map(staff => [
        staff.first_name || '',
        staff.last_name || '',
        staff.email || '',
        staff.phone || '',
        staff.designation || '',
        staff.department || '',
        staff.role || '',
        staff.branches?.name || '',
        staff.is_active ? 'Active' : 'Inactive',
        staff.joining_date || '',
        staff.city || '',
        staff.state || ''
      ].map(field => `"${field}"`).join(','))
    ];

    const csvContent = csvRows.join('\n');

    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', `attachment; filename="staff-export-${new Date().toISOString().split('T')[0]}.csv"`);
    
    return res.status(200).send(csvContent);
  } catch (error) {
    console.error('Export staff error:', error);
    return res.status(500).json({ success: false, error: 'Failed to export staff data' });
  }
}