import { supabaseAdmin } from '@/lib/supabase';
import { AuthUtils } from '@/utils/auth';

export default async function handler(req, res) {
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
      .select('company_id, role')
      .eq('id', userId)
      .single();

    if (userError || !userData) {
      return res.status(404).json({ success: false, error: 'User not found' });
    }

    if (req.method === 'GET') {
      return handleGetStaff(req, res, userData.company_id);
    } else if (req.method === 'POST') {
      return handleCreateStaff(req, res, userData);
    } else {
      return res.status(405).json({ success: false, error: 'Method not allowed' });
    }
  } catch (error) {
    console.error('Staff API error:', error);
    return res.status(500).json({ success: false, error: 'Internal server error' });
  }
}

async function handleGetStaff(req, res, companyId) {
  try {
    const {
      search = '',
      branch = '',
      role = '',
      status = 'all',
      department = '',
      page = 1,
      limit = 10
    } = req.query;

    let query = supabaseAdmin
      .from('users')
      .select(`
        id,
        branch_id,
        company_id,
        username,
        email,
        phone,
        phone_verified,
        aadhar_number,
        pan_number,
        first_name,
        last_name,
        middle_name,
        designation,
        department,
        date_of_birth,
        gender,
        language_preference,
        address,
        city,
        state,
        pincode,
        emergency_contact_name,
        emergency_contact_phone,
        profile_picture_url,
        role,
        salary,
        joining_date,
        reporting_manager_id,
        is_active,
        last_login,
        created_at,
        updated_at,
        branches:branch_id (
          id,
          name,
          is_head_office
        )
      `)
      .eq('company_id', companyId);

    // Apply filters
    if (search) {
      query = query.or(`first_name.ilike.%${search}%,last_name.ilike.%${search}%,email.ilike.%${search}%,phone.ilike.%${search}%,username.ilike.%${search}%`);
    }

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

    // Get total count
    const { count } = await supabaseAdmin
      .from('users')
      .select('*', { count: 'exact', head: true })
      .eq('company_id', companyId);

    // Apply pagination
    const from = (parseInt(page) - 1) * parseInt(limit);
    const to = from + parseInt(limit) - 1;
    
    query = query.range(from, to).order('created_at', { ascending: false });

    const { data, error } = await query;

    if (error) {
      throw error;
    }

    return res.status(200).json({
      success: true,
      data: data || [],
      total: count || 0,
      page: parseInt(page),
      limit: parseInt(limit)
    });
  } catch (error) {
    console.error('Get staff error:', error);
    return res.status(500).json({ success: false, error: 'Failed to fetch staff' });
  }
}

async function handleCreateStaff(req, res, userData) {
  try {
    const staffData = req.body;

    // Validate required fields
    const requiredFields = ['first_name', 'last_name', 'email', 'phone', 'role'];
    for (const field of requiredFields) {
      if (!staffData[field]) {
        return res.status(400).json({ 
          success: false, 
          error: `${field.replace('_', ' ')} is required` 
        });
      }
    }

    // Check if email/phone already exists in the company
    const { data: existingUser } = await supabaseAdmin
      .from('users')
      .select('id')
      .eq('company_id', userData.company_id)
      .or(`email.eq.${staffData.email},phone.eq.${staffData.phone}`)
      .single();

    if (existingUser) {
      return res.status(400).json({ 
        success: false, 
        error: 'Email or phone already exists in your company' 
      });
    }

    // Create the staff member
    const { data, error } = await supabaseAdmin
      .from('users')
      .insert({
        company_id: userData.company_id,
        branch_id: staffData.branch_id || null,
        username: staffData.username || staffData.email,
        email: staffData.email,
        phone: staffData.phone,
        phone_verified: false,
        first_name: staffData.first_name,
        last_name: staffData.last_name,
        middle_name: staffData.middle_name || null,
        designation: staffData.designation || null,
        department: staffData.department || null,
        date_of_birth: staffData.date_of_birth || null,
        gender: staffData.gender || null,
        language_preference: staffData.language_preference || 'en',
        address: staffData.address || null,
        city: staffData.city || null,
        state: staffData.state || null,
        pincode: staffData.pincode || null,
        emergency_contact_name: staffData.emergency_contact_name || null,
        emergency_contact_phone: staffData.emergency_contact_phone || null,
        role: staffData.role,
        salary: staffData.salary ? parseFloat(staffData.salary) : null,
        joining_date: staffData.joining_date || new Date().toISOString().split('T')[0],
        reporting_manager_id: staffData.reporting_manager_id || null,
        aadhar_number: staffData.aadhar_number || null,
        pan_number: staffData.pan_number || null,
        is_active: staffData.is_active !== false,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })
      .select(`
        *,
        branches:branch_id (
          id,
          name,
          is_head_office
        )
      `)
      .single();

    if (error) {
      console.error('Supabase insert error:', error);
      throw error;
    }

    // Update company staff count
    await supabaseAdmin.rpc('increment_staff_count', { company_id: userData.company_id });

    return res.status(201).json({
      success: true,
      data,
      message: 'Staff member created successfully'
    });
  } catch (error) {
    console.error('Create staff error:', error);
    return res.status(500).json({ success: false, error: 'Failed to create staff member' });
  }
}