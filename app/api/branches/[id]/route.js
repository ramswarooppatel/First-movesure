import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

// Get single branch
export async function GET(request, { params }) {
  try {
    const { id } = params;

    const { data: branch, error } = await supabaseAdmin
      .from('branches')
      .select(`
        *,
        users:users(count)
      `)
      .eq('id', id)
      .single();

    if (error || !branch) {
      return NextResponse.json(
        { error: 'Branch not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ branch });

  } catch (error) {
    console.error('Error fetching branch:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// Update branch
export async function PUT(request, { params }) {
  try {
    const { id } = params;
    const body = await request.json();

    // Validate required fields
    if (!body.name?.trim()) {
      return NextResponse.json(
        { error: 'Branch name is required' },
        { status: 400 }
      );
    }

    // Check if branch exists
    const { data: existingBranch, error: fetchError } = await supabaseAdmin
      .from('branches')
      .select('*')
      .eq('id', id)
      .single();

    if (fetchError || !existingBranch) {
      return NextResponse.json(
        { error: 'Branch not found' },
        { status: 404 }
      );
    }

    // Check if branch code already exists for this company (excluding current branch)
    if (body.code && body.code !== existingBranch.code) {
      const { data: duplicateBranch } = await supabaseAdmin
        .from('branches')
        .select('id')
        .eq('company_id', existingBranch.company_id)
        .eq('code', body.code)
        .neq('id', id)
        .single();

      if (duplicateBranch) {
        return NextResponse.json(
          { error: 'Branch code already exists for this company' },
          { status: 400 }
        );
      }
    }

    // If this is set as head office, make sure no other branch is head office
    if (body.is_head_office && !existingBranch.is_head_office) {
      await supabaseAdmin
        .from('branches')
        .update({ is_head_office: false })
        .eq('company_id', existingBranch.company_id)
        .eq('is_head_office', true);
    }

    const { data: branch, error } = await supabaseAdmin
      .from('branches')
      .update({
        name: body.name,
        code: body.code,
        address: body.address,
        city: body.city,
        state: body.state,
        country: body.country || 'India',
        pincode: body.pincode,
        phone: body.phone,
        email: body.email,
        is_head_office: body.is_head_office || false,
        is_active: body.is_active !== false,
        opening_time: body.opening_time || '09:00',
        closing_time: body.closing_time || '18:00',
        working_days: body.working_days || 'Monday,Tuesday,Wednesday,Thursday,Friday,Saturday',
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .select()
      .single();

    if (error) {
      return NextResponse.json(
        { error: 'Failed to update branch', details: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({ 
      message: 'Branch updated successfully', 
      branch 
    });

  } catch (error) {
    console.error('Error updating branch:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// Delete branch
export async function DELETE(request, { params }) {
  try {
    const { id } = params;

    // Check if branch exists and get details
    const { data: existingBranch, error: fetchError } = await supabaseAdmin
      .from('branches')
      .select('*')
      .eq('id', id)
      .single();

    if (fetchError || !existingBranch) {
      return NextResponse.json(
        { error: 'Branch not found' },
        { status: 404 }
      );
    }

    // Check if there are users assigned to this branch
    const { data: users, error: usersError } = await supabaseAdmin
      .from('users')
      .select('id')
      .eq('branch_id', id);

    if (usersError) {
      return NextResponse.json(
        { error: 'Failed to check branch users' },
        { status: 500 }
      );
    }

    if (users && users.length > 0) {
      return NextResponse.json(
        { error: 'Cannot delete branch with assigned users. Please reassign users first.' },
        { status: 400 }
      );
    }

    // Delete the branch
    const { error: deleteError } = await supabaseAdmin
      .from('branches')
      .delete()
      .eq('id', id);

    if (deleteError) {
      return NextResponse.json(
        { error: 'Failed to delete branch', details: deleteError.message },
        { status: 500 }
      );
    }

    return NextResponse.json({ 
      message: 'Branch deleted successfully' 
    });

  } catch (error) {
    console.error('Error deleting branch:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}