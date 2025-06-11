import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';
import { cookies } from 'next/headers'; // Add this missing import

export async function GET(request) {
  try {
    // Get company_id from headers
    const companyId = request.headers.get('x-company-id');
    
    if (!companyId) {
      return NextResponse.json(
        { error: 'Company ID is required' },
        { status: 400 }
      );
    }

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '12');
    const search = searchParams.get('search') || '';
    const status = searchParams.get('status') || 'all';
    const is_head_office = searchParams.get('is_head_office') || 'all';
    const city = searchParams.get('city') || '';
    const state = searchParams.get('state') || '';

    // Calculate offset for pagination
    const offset = (page - 1) * limit;

    // Build the query - FILTER BY COMPANY ID
    let query = supabaseAdmin
      .from('branches')
      .select(`
        *,
        companies!inner(
          id,
          name,
          email,
          phone
        )
      `)
      .eq('company_id', companyId);

    // Apply additional filters
    if (search) {
      query = query.or(`name.ilike.%${search}%,code.ilike.%${search}%,city.ilike.%${search}%`);
    }

    if (status !== 'all') {
      query = query.eq('is_active', status === 'active');
    }

    if (is_head_office !== 'all') {
      query = query.eq('is_head_office', is_head_office === 'true');
    }

    if (city) {
      query = query.ilike('city', `%${city}%`);
    }

    if (state) {
      query = query.ilike('state', `%${state}%`);
    }

    // Get total count for pagination (also filtered by company)
    const { count: totalCount } = await supabaseAdmin
      .from('branches')
      .select('*', { count: 'exact', head: true })
      .eq('company_id', companyId);

    // Execute query with pagination
    const { data: branches, error } = await query
      .range(offset, offset + limit - 1)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Database error:', error);
      return NextResponse.json(
        { error: 'Failed to fetch branches', details: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({
      branches: branches || [],
      pagination: {
        currentPage: page,
        totalPages: Math.ceil((totalCount || 0) / limit),
        totalItems: totalCount || 0,
        hasNextPage: page < Math.ceil((totalCount || 0) / limit),
        hasPreviousPage: page > 1
      }
    });

  } catch (error) {
    console.error('API error:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: error.message },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    // Get user from session/token for company_id
    const cookieStore = cookies();
    const token = cookieStore.get('access_token')?.value;
    
    if (!token) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    // Get user's company_id
    const { data: tokenData, error: tokenError } = await supabaseAdmin
      .from('access_tokens')
      .select(`
        user_id,
        users!inner(
          id,
          company_id
        )
      `)
      .eq('token', token)
      .eq('is_revoked', false)
      .gt('expires_at', new Date().toISOString())
      .single();

    if (tokenError || !tokenData) {
      return NextResponse.json(
        { error: 'Invalid or expired token' },
        { status: 401 }
      );
    }

    const companyId = tokenData.users.company_id;
    const body = await request.json();
    
    const { data: branch, error } = await supabaseAdmin
      .from('branches')
      .insert({
        company_id: companyId, // Use authenticated user's company_id
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
        working_days: body.working_days || 'Monday,Tuesday,Wednesday,Thursday,Friday,Saturday'
      })
      .select()
      .single();

    if (error) {
      return NextResponse.json(
        { error: 'Failed to create branch', details: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({ branch }, { status: 201 });
  } catch (error) {
    console.error('Create branch error:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: error.message },
      { status: 500 }
    );
  }
}