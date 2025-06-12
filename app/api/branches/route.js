import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

// Get branches
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '12');
    const search = searchParams.get('search') || '';
    const status = searchParams.get('status') || 'all';
    const is_head_office = searchParams.get('is_head_office') || 'all';
    const city = searchParams.get('city') || '';
    const state = searchParams.get('state') || '';
    const companyId = searchParams.get('companyId');

    console.log('API - Received params:', {
      page, limit, search, status, is_head_office, city, state, companyId
    });

    // Validate company ID
    if (!companyId) {
      return NextResponse.json(
        { error: 'Company ID is required' },
        { status: 400 }
      );
    }

    // Build main query (removed user count for performance)
    let query = supabaseAdmin
      .from('branches')
      .select('*')
      .eq('company_id', companyId);

    // Apply filters
    if (search) {
      query = query.or(`name.ilike.%${search}%,code.ilike.%${search}%,city.ilike.%${search}%`);
    }

    if (status !== 'all') {
      const isActive = status === 'active';
      query = query.eq('is_active', isActive);
    }

    if (is_head_office !== 'all') {
      const isHeadOffice = is_head_office === 'true';
      query = query.eq('is_head_office', isHeadOffice);
    }

    if (city) {
      query = query.ilike('city', `%${city}%`);
    }

    if (state) {
      query = query.ilike('state', `%${state}%`);
    }

    // Get total count for pagination
    const countQuery = supabaseAdmin
      .from('branches')
      .select('*', { count: 'exact', head: true })
      .eq('company_id', companyId);

    // Apply same filters to count query
    if (search) {
      countQuery.or(`name.ilike.%${search}%,code.ilike.%${search}%,city.ilike.%${search}%`);
    }
    if (status !== 'all') {
      countQuery.eq('is_active', status === 'active');
    }
    if (is_head_office !== 'all') {
      countQuery.eq('is_head_office', is_head_office === 'true');
    }
    if (city) {
      countQuery.ilike('city', `%${city}%`);
    }
    if (state) {
      countQuery.ilike('state', `%${state}%`);
    }

    const { count: totalItems, error: countError } = await countQuery;

    if (countError) {
      console.error('Count error:', countError);
      return NextResponse.json(
        { error: 'Failed to get branch count', details: countError.message },
        { status: 500 }
      );
    }

    // Apply pagination and ordering
    const offset = (page - 1) * limit;
    query = query
      .order('is_head_office', { ascending: false })
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1);

    const { data: branches, error } = await query;

    if (error) {
      console.error('Branches fetch error:', error);
      return NextResponse.json(
        { error: 'Failed to fetch branches', details: error.message },
        { status: 500 }
      );
    }

    // Calculate pagination info
    const totalPages = Math.ceil((totalItems || 0) / limit);
    const hasNextPage = page < totalPages;
    const hasPreviousPage = page > 1;

    console.log('API - Returning:', {
      branchesCount: branches?.length || 0,
      totalItems,
      totalPages
    });

    return NextResponse.json({
      branches: branches || [],
      pagination: {
        currentPage: page,
        totalPages,
        totalItems: totalItems || 0,
        hasNextPage,
        hasPreviousPage,
        limit
      }
    });

  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: error.message },
      { status: 500 }
    );
  }
}

// Create branch
export async function POST(request) {
  try {
    const body = await request.json();

    console.log('Creating branch with data:', body);

    // Validate required fields
    if (!body.name?.trim()) {
      return NextResponse.json(
        { error: 'Branch name is required' },
        { status: 400 }
      );
    }

    if (!body.company_id) {
      return NextResponse.json(
        { error: 'Company ID is required' },
        { status: 400 }
      );
    }

    // Check if branch code already exists for this company
    if (body.code) {
      const { data: existingBranch } = await supabaseAdmin
        .from('branches')
        .select('id')
        .eq('company_id', body.company_id)
        .eq('code', body.code)
        .single();

      if (existingBranch) {
        return NextResponse.json(
          { error: 'Branch code already exists for this company' },
          { status: 400 }
        );
      }
    }

    // If this is set as head office, make sure no other branch is head office
    if (body.is_head_office) {
      await supabaseAdmin
        .from('branches')
        .update({ is_head_office: false })
        .eq('company_id', body.company_id)
        .eq('is_head_office', true);
    }

    const { data: branch, error } = await supabaseAdmin
      .from('branches')
      .insert([{
        company_id: body.company_id,
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
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }])
      .select()
      .single();

    if (error) {
      console.error('Branch creation error:', error);
      return NextResponse.json(
        { error: 'Failed to create branch', details: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({ 
      message: 'Branch created successfully', 
      branch 
    });

  } catch (error) {
    console.error('Error creating branch:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: error.message },
      { status: 500 }
    );
  }
}