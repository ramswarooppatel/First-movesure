import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';
import { AuthUtils } from '@/utils/auth';
import bcrypt from 'bcryptjs';

// UPDATE staff member
export async function PUT(request, { params }) {
  try {
    const { id } = await params; // Fix: await params before destructuring
    const staffData = await request.json();
    
    const authHeader = request.headers.get('authorization');
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'No token provided' }, { status: 401 });
    }

    const token = authHeader.split(' ')[1];
    const decoded = AuthUtils.verifyToken(token);
    
    if (!decoded) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
    }

    const { userId } = decoded;

    // Get user's company to verify access
    const { data: userData, error: userError } = await supabaseAdmin
      .from('users')
      .select('company_id, role')
      .eq('id', userId)
      .single();

    if (userError || !userData) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    console.log('🔄 Updating staff member:', { id, staffData });

    // Prepare update data with proper UUID handling
    const updateData = {
      first_name: staffData.first_name,
      last_name: staffData.last_name,
      middle_name: staffData.middle_name,
      email: staffData.email,
      phone: staffData.phone,
      username: staffData.username,
      designation: staffData.designation,
      department: staffData.department,
      role: staffData.role,
      branch_id: staffData.branch_id || null, // Handle UUID properly
      date_of_birth: staffData.date_of_birth,
      gender: staffData.gender,
      address: staffData.address,
      city: staffData.city,
      state: staffData.state,
      pincode: staffData.pincode,
      country: staffData.country,
      aadhar_number: staffData.aadhar_number,
      pan_number: staffData.pan_number,
      salary: staffData.salary,
      joining_date: staffData.joining_date,
      reporting_manager_id: staffData.reporting_manager_id || null, // Fix: Handle UUID properly
      emergency_contact_name: staffData.emergency_contact_name,
      emergency_contact_phone: staffData.emergency_contact_phone,
      is_active: staffData.is_active,
      profile_picture_url: staffData.profile_picture_url,
      phone_verified: staffData.phone_verified,
      email_verified: staffData.email_verified,
      pan_verified: staffData.pan_verified,
      aadhar_verified: staffData.aadhar_verified,
      updated_at: new Date().toISOString()
    };

    // Fix: Validate reporting_manager_id is a valid UUID if provided
    if (updateData.reporting_manager_id !== null) {
      const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
      if (!uuidRegex.test(updateData.reporting_manager_id)) {
        console.error('Invalid reporting_manager_id UUID:', updateData.reporting_manager_id);
        return NextResponse.json(
          { error: 'Invalid reporting manager selection' },
          { status: 400 }
        );
      }
    }

    // Hash password if provided
    if (staffData.password && staffData.password.trim() !== '') {
      const saltRounds = 12;
      updateData.password_hash = await bcrypt.hash(staffData.password, saltRounds);
    }

    // Check if username is unique (excluding current staff)
    if (staffData.username) {
      const { data: existingStaff } = await supabaseAdmin
        .from('users')
        .select('id')
        .eq('username', staffData.username)
        .neq('id', id)
        .eq('company_id', userData.company_id)
        .single();

      if (existingStaff) {
        return NextResponse.json(
          { error: 'Username already exists' },
          { status: 400 }
        );
      }
    }

    // Check if email is unique (excluding current staff)
    if (staffData.email) {
      const { data: existingEmail } = await supabaseAdmin
        .from('users')
        .select('id')
        .eq('email', staffData.email)
        .neq('id', id)
        .eq('company_id', userData.company_id)
        .single();

      if (existingEmail) {
        return NextResponse.json(
          { error: 'Email already exists' },
          { status: 400 }
        );
      }
    }

    // Update staff record
    const { data: updatedStaff, error: updateError } = await supabaseAdmin
      .from('users')
      .update(updateData)
      .eq('id', id)
      .eq('company_id', userData.company_id)
      .select(`
        *,
        branches:branch_id (
          id,
          name,
          code,
          city,
          state,
          is_head_office
        )
      `)
      .single();

    if (updateError) {
      console.error('❌ Database update error:', updateError);
      return NextResponse.json(
        { error: updateError.message },
        { status: 500 }
      );
    }

    console.log('✅ Staff updated successfully:', updatedStaff);

    return NextResponse.json({
      success: true,
      data: updatedStaff,
      message: 'Staff member updated successfully'
    });

  } catch (error) {
    console.error('❌ Update staff error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// GET single staff member
export async function GET(request, { params }) {
  try {
    const { id } = await params; // Fix: await params
    const authHeader = request.headers.get('authorization');
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'No token provided' }, { status: 401 });
    }

    const token = authHeader.split(' ')[1];
    const decoded = AuthUtils.verifyToken(token);
    
    if (!decoded) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
    }

    const { userId } = decoded;

    // Get user's company to verify access
    const { data: userData, error: userError } = await supabaseAdmin
      .from('users')
      .select('company_id')
      .eq('id', userId)
      .single();

    if (userError || !userData) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Get staff member with branch information
    const { data: staff, error } = await supabaseAdmin
      .from('users')
      .select(`
        *,
        branches:branch_id (
          id,
          name,
          code,
          city,
          state,
          is_head_office,
          address,
          phone,
          email
        )
      `)
      .eq('id', id)
      .eq('company_id', userData.company_id)
      .single();

    if (error || !staff) {
      return NextResponse.json({ error: 'Staff member not found' }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      data: staff
    });

  } catch (error) {
    console.error('Get staff error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// DELETE staff member
export async function DELETE(request, { params }) {
  try {
    const { id } = await params; // Fix: await params
    const authHeader = request.headers.get('authorization');
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'No token provided' }, { status: 401 });
    }

    const token = authHeader.split(' ')[1];
    const decoded = AuthUtils.verifyToken(token);
    
    if (!decoded) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
    }

    const { userId } = decoded;

    // Get user's company to verify access
    const { data: userData, error: userError } = await supabaseAdmin
      .from('users')
      .select('company_id, role')
      .eq('id', userId)
      .single();

    if (userError || !userData) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Check permissions
    if (!['super_admin', 'admin'].includes(userData.role)) {
      return NextResponse.json({ error: 'Insufficient permissions' }, { status: 403 });
    }

    // Get staff data before deletion
    const { data: staffData, error: getError } = await supabaseAdmin
      .from('users')
      .select('first_name, last_name, email')
      .eq('id', id)
      .eq('company_id', userData.company_id)
      .single();

    if (getError || !staffData) {
      return NextResponse.json({ error: 'Staff member not found' }, { status: 404 });
    }

    // Delete staff member
    const { error: deleteError } = await supabaseAdmin
      .from('users')
      .delete()
      .eq('id', id)
      .eq('company_id', userData.company_id);

    if (deleteError) {
      console.error('Error deleting staff:', deleteError);
      return NextResponse.json({ error: 'Failed to delete staff member' }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      message: `Staff member ${staffData.first_name} ${staffData.last_name} has been deleted successfully`,
      data: {
        deletedStaff: {
          id,
          name: `${staffData.first_name} ${staffData.last_name}`,
          email: staffData.email
        }
      }
    });

  } catch (error) {
    console.error('Delete staff error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}