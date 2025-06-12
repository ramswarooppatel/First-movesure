import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';
import { AuthUtils } from '@/utils/auth';

// GET single branch
export async function GET(request, { params }) {
  try {
    const { id } = params;
    const authHeader = request.headers.get('authorization');
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        { success: false, error: 'No token provided' },
        { status: 401 }
      );
    }

    const token = authHeader.split(' ')[1];
    const decoded = AuthUtils.verifyToken(token);
    
    if (!decoded) {
      return NextResponse.json(
        { success: false, error: 'Invalid token' },
        { status: 401 }
      );
    }

    const { userId } = decoded;

    // Get user's company to verify access
    const { data: userData, error: userError } = await supabaseAdmin
      .from('users')
      .select('company_id, role')
      .eq('id', userId)
      .single();

    if (userError || !userData) {
      return NextResponse.json(
        { success: false, error: 'User not found' },
        { status: 404 }
      );
    }

    // Get branch details
    const { data: branchData, error: branchError } = await supabaseAdmin
      .from('branches')
      .select(`
        *,
        users:users!branch_id(count)
      `)
      .eq('id', id)
      .eq('company_id', userData.company_id)
      .single();

    if (branchError || !branchData) {
      return NextResponse.json(
        { success: false, error: 'Branch not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: branchData
    });
  } catch (error) {
    console.error('Branch fetch API error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// UPDATE branch
export async function PUT(request, { params }) {
  try {
    const { id } = params;
    const body = await request.json();
    const authHeader = request.headers.get('authorization');
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        { success: false, error: 'No token provided' },
        { status: 401 }
      );
    }

    const token = authHeader.split(' ')[1];
    const decoded = AuthUtils.verifyToken(token);
    
    if (!decoded) {
      return NextResponse.json(
        { success: false, error: 'Invalid token' },
        { status: 401 }
      );
    }

    const { userId } = decoded;

    // Get user's company to verify access
    const { data: userData, error: userError } = await supabaseAdmin
      .from('users')
      .select('company_id, role')
      .eq('id', userId)
      .single();

    if (userError || !userData) {
      return NextResponse.json(
        { success: false, error: 'User not found' },
        { status: 404 }
      );
    }

    // Check user permissions
    if (!['super_admin', 'admin', 'branch_manager'].includes(userData.role)) {
      return NextResponse.json(
        { success: false, error: 'Insufficient permissions to update branches' },
        { status: 403 }
      );
    }

    // Validate required fields
    if (!body.name?.trim()) {
      return NextResponse.json(
        { success: false, error: 'Branch name is required' },
        { status: 400 }
      );
    }

    // Check if branch exists and belongs to user's company
    const { data: existingBranch, error: fetchError } = await supabaseAdmin
      .from('branches')
      .select('*')
      .eq('id', id)
      .eq('company_id', userData.company_id)
      .single();

    if (fetchError || !existingBranch) {
      return NextResponse.json(
        { success: false, error: 'Branch not found or access denied' },
        { status: 404 }
      );
    }

    // Check if branch code already exists for this company (excluding current branch)
    if (body.code && body.code !== existingBranch.code) {
      const { data: duplicateBranch } = await supabaseAdmin
        .from('branches')
        .select('id')
        .eq('company_id', userData.company_id)
        .eq('code', body.code)
        .neq('id', id)
        .single();

      if (duplicateBranch) {
        return NextResponse.json(
          { success: false, error: 'Branch code already exists for this company' },
          { status: 400 }
        );
      }
    }

    // Update the branch
    const { data: branch, error } = await supabaseAdmin
      .from('branches')
      .update({
        name: body.name.trim(),
        code: body.code?.trim() || null,
        address: body.address?.trim() || null,
        city: body.city?.trim() || null,
        state: body.state?.trim() || null,
        country: body.country || 'India',
        pincode: body.pincode?.trim() || null,
        phone: body.phone?.trim() || null,
        email: body.email?.trim() || null,
        is_head_office: body.is_head_office || false,
        is_active: body.is_active !== false,
        opening_time: body.opening_time || '09:00',
        closing_time: body.closing_time || '18:00',
        working_days: body.working_days || 'Monday,Tuesday,Wednesday,Thursday,Friday,Saturday',
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .eq('company_id', userData.company_id)
      .select()
      .single();

    if (error) {
      console.error('Branch update error:', error);
      return NextResponse.json(
        { success: false, error: 'Failed to update branch', details: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({ 
      success: true,
      message: 'Branch updated successfully', 
      data: branch 
    });

  } catch (error) {
    console.error('Error updating branch:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error', details: error.message },
      { status: 500 }
    );
  }
}

// DELETE branch
export async function DELETE(request, { params }) {
  try {
    const { id } = params;
    const authHeader = request.headers.get('authorization');
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        { success: false, error: 'No token provided' },
        { status: 401 }
      );
    }

    const token = authHeader.split(' ')[1];
    const decoded = AuthUtils.verifyToken(token);
    
    if (!decoded) {
      return NextResponse.json(
        { success: false, error: 'Invalid token' },
        { status: 401 }
      );
    }

    const { userId } = decoded;

    // Get user's company to verify access
    const { data: userData, error: userError } = await supabaseAdmin
      .from('users')
      .select('company_id, role')
      .eq('id', userId)
      .single();

    if (userError || !userData) {
      return NextResponse.json(
        { success: false, error: 'User not found' },
        { status: 404 }
      );
    }

    // Check user permissions (only admins and super_admins can delete branches)
    if (!['super_admin', 'admin'].includes(userData.role)) {
      return NextResponse.json(
        { success: false, error: 'Insufficient permissions to delete branches' },
        { status: 403 }
      );
    }

    // Verify branch exists and belongs to user's company
    const { data: branchData, error: branchError } = await supabaseAdmin
      .from('branches')
      .select(`
        id, 
        name, 
        code, 
        company_id, 
        is_head_office,
        city,
        state
      `)
      .eq('id', id)
      .eq('company_id', userData.company_id)
      .single();

    if (branchError || !branchData) {
      return NextResponse.json(
        { success: false, error: 'Branch not found or access denied' },
        { status: 404 }
      );
    }

    // Check if there are staff assigned to this branch and unassign them
    const { data: assignedStaff, error: staffCheckError } = await supabaseAdmin
      .from('users')
      .select('id, first_name, last_name, email')
      .eq('branch_id', id)
      .eq('company_id', userData.company_id);

    if (staffCheckError) {
      console.error('Error checking assigned staff:', staffCheckError);
      return NextResponse.json(
        { success: false, error: 'Failed to check branch dependencies' },
        { status: 500 }
      );
    }

    // Unassign staff from this branch
    if (assignedStaff && assignedStaff.length > 0) {
      const { error: unassignError } = await supabaseAdmin
        .from('users')
        .update({ 
          branch_id: null, 
          updated_at: new Date().toISOString() 
        })
        .eq('branch_id', id)
        .eq('company_id', userData.company_id);

      if (unassignError) {
        console.error('Error unassigning staff:', unassignError);
        return NextResponse.json(
          { success: false, error: 'Failed to unassign staff from branch before deletion' },
          { status: 500 }
        );
      }

      console.log(`Unassigned ${assignedStaff.length} staff members from branch ${branchData.name}`);
    }

    // Now delete the branch
    const { error: deleteError } = await supabaseAdmin
      .from('branches')
      .delete()
      .eq('id', id)
      .eq('company_id', userData.company_id);

    if (deleteError) {
      console.error('Error deleting branch:', deleteError);
      return NextResponse.json(
        { success: false, error: 'Failed to delete branch from database' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: `Branch "${branchData.name}" has been successfully deleted`,
      data: {
        deletedBranch: {
          id: branchData.id,
          name: branchData.name,
          code: branchData.code,
          city: branchData.city,
          state: branchData.state,
          is_head_office: branchData.is_head_office
        },
        unassignedStaff: assignedStaff?.length || 0,
        staffList: assignedStaff?.map(staff => ({
          id: staff.id,
          name: `${staff.first_name} ${staff.last_name}`.trim(),
          email: staff.email
        })) || []
      }
    });

  } catch (error) {
    console.error('Branch deletion API error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error during branch deletion' },
      { status: 500 }
    );
  }
}