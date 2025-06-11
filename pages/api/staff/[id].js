import { supabaseAdmin } from '@/lib/supabase';
import { AuthUtils } from '@/utils/auth';

export default async function handler(req, res) {
  const { id } = req.query;

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

    if (req.method === 'PUT') {
      return handleUpdateStaff(req, res, id, userData);
    } else if (req.method === 'DELETE') {
      return handleDeleteStaff(req, res, id, userData);
    } else {
      return res.status(405).json({ success: false, error: 'Method not allowed' });
    }
  } catch (error) {
    console.error('Staff API error:', error);
    return res.status(500).json({ success: false, error: 'Internal server error' });
  }
}

async function handleUpdateStaff(req, res, staffId, userData) {
  try {
    const staffData = req.body;

    // Validate that the staff belongs to the same company
    const { data: existingStaff, error: staffError } = await supabaseAdmin
      .from('users')
      .select('id, company_id')
      .eq('id', staffId)
      .eq('company_id', userData.company_id)
      .single();

    if (staffError || !existingStaff) {
      return res.status(404).json({ 
        success: false, 
        error: 'Staff member not found' 
      });
    }

    // Update the staff member
    const { data, error } = await supabaseAdmin
      .from('users')
      .update({
        username: staffData.username,
        email: staffData.email,
        phone: staffData.phone,
        first_name: staffData.first_name,
        last_name: staffData.last_name,
        middle_name: staffData.middle_name,
        designation: staffData.designation,
        department: staffData.department,
        date_of_birth: staffData.date_of_birth,
        gender: staffData.gender,
        address: staffData.address,
        city: staffData.city,
        state: staffData.state,
        pincode: staffData.pincode,
        role: staffData.role,
        branch_id: staffData.branch_id,
        salary: staffData.salary,
        joining_date: staffData.joining_date,
        reporting_manager_id: staffData.reporting_manager_id,
        emergency_contact_name: staffData.emergency_contact_name,
        emergency_contact_phone: staffData.emergency_contact_phone,
        aadhar_number: staffData.aadhar_number,
        pan_number: staffData.pan_number,
        is_active: staffData.is_active,
        updated_at: new Date().toISOString()
      })
      .eq('id', staffId)
      .select()
      .single();

    if (error) {
      throw error;
    }

    return res.status(200).json({
      success: true,
      data,
      message: 'Staff member updated successfully'
    });
  } catch (error) {
    console.error('Update staff error:', error);
    return res.status(500).json({ success: false, error: 'Failed to update staff member' });
  }
}

async function handleDeleteStaff(req, res, staffId, userData) {
  try {
    // Validate that the staff belongs to the same company
    const { data: existingStaff, error: staffError } = await supabaseAdmin
      .from('users')
      .select('id, company_id, role')
      .eq('id', staffId)
      .eq('company_id', userData.company_id)
      .single();

    if (staffError || !existingStaff) {
      return res.status(404).json({ 
        success: false, 
        error: 'Staff member not found' 
      });
    }

    // Prevent deletion of super admin
    if (existingStaff.role === 'super_admin') {
      return res.status(400).json({ 
        success: false, 
        error: 'Cannot delete super admin account' 
      });
    }

    // Soft delete by setting is_active to false
    const { data, error } = await supabaseAdmin
      .from('users')
      .update({
        is_active: false,
        updated_at: new Date().toISOString()
      })
      .eq('id', staffId)
      .select()
      .single();

    if (error) {
      throw error;
    }

    return res.status(200).json({
      success: true,
      data,
      message: 'Staff member deactivated successfully'
    });
  } catch (error) {
    console.error('Delete staff error:', error);
    return res.status(500).json({ success: false, error: 'Failed to delete staff member' });
  }
}