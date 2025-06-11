import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';

export async function GET(request) {
  try {
    // Get company_id and branch_id from headers OR URL params as fallback
    let companyId = request.headers.get('x-company-id');
    let branchId = request.headers.get('x-branch-id');
    
    // Fallback: Try to get from URL params if headers are missing
    const { searchParams } = new URL(request.url);
    if (!companyId) companyId = searchParams.get('company_id');
    if (!branchId) branchId = searchParams.get('branch_id');
    
    console.log('API - Final companyId:', companyId);
    console.log('API - Final branchId:', branchId);
    
    if (!branchId) {
      return NextResponse.json(
        { error: 'Branch ID is required' },
        { status: 400 }
      );
    }

    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const search = searchParams.get('search') || '';
    const role = searchParams.get('role') || 'all';
    const isActive = searchParams.get('is_active') || 'all';

    console.log('API - Query params:', { page, limit, search, role, isActive });

    // Calculate offset for pagination
    const offset = (page - 1) * limit;

    // First, get branch information separately

    console.log('Fetching branch information...');
    const { data: branchInfo, error: branchError } = await supabaseAdmin
      .from('branches')
      .select('id, name, code, is_head_office, company_id, city, state')
      .eq('id', branchId)
      .single();

    if (branchError) {
      console.log('Branch fetch error:', branchError);
      return NextResponse.json(
        { 
          error: 'Branch not found',
          details: branchError.message,
          debug: { branchId, companyId }
        },
        { status: 404 }
      );
    }

    // Use the company ID from the branch if not provided
    const finalCompanyId = companyId || branchInfo.company_id;

    console.log('Branch found:', branchInfo);
    console.log('Using company ID:', finalCompanyId);

    // Build the main query to fetch staff (without JOIN for now)
    console.log('Building main staff query...');
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
        updated_at
      `)
      .eq('branch_id', branchId);

    // Add company filter if provided
    if (finalCompanyId) {
      query = query.eq('company_id', finalCompanyId);
    }

    // Apply additional filters
    if (search && search.trim()) {
      const searchTerm = search.trim();
      console.log('Applying search filter:', searchTerm);
      query = query.or(`first_name.ilike.%${searchTerm}%,last_name.ilike.%${searchTerm}%,email.ilike.%${searchTerm}%,phone.ilike.%${searchTerm}%,designation.ilike.%${searchTerm}%,username.ilike.%${searchTerm}%`);
    }

    if (role !== 'all') {
      console.log('Applying role filter:', role);
      query = query.eq('role', role);
    }

    if (isActive !== 'all') {
      const activeStatus = isActive === 'active';
      console.log('Applying active status filter:', activeStatus);
      query = query.eq('is_active', activeStatus);
    }

    // Get total count for pagination with same filters
    console.log('Getting total count...');
    let countQuery = supabaseAdmin
      .from('users')
      .select('*', { count: 'exact', head: true })
      .eq('branch_id', branchId);

    if (finalCompanyId) {
      countQuery = countQuery.eq('company_id', finalCompanyId);
    }

    // Apply same filters to count query
    if (search && search.trim()) {
      const searchTerm = search.trim();
      countQuery = countQuery.or(`first_name.ilike.%${searchTerm}%,last_name.ilike.%${searchTerm}%,email.ilike.%${searchTerm}%,phone.ilike.%${searchTerm}%,designation.ilike.%${searchTerm}%,username.ilike.%${searchTerm}%`);
    }

    if (role !== 'all') {
      countQuery = countQuery.eq('role', role);
    }

    if (isActive !== 'all') {
      countQuery = countQuery.eq('is_active', isActive === 'active');
    }

    const { count: totalCount, error: countError } = await countQuery;

    if (countError) {
      console.error('Count query error:', countError);
      return NextResponse.json(
        { 
          error: 'Failed to get staff count', 
          details: countError.message,
          debug: { 
            companyId: finalCompanyId, 
            branchId, 
            search, 
            role, 
            isActive,
            sqlCode: countError.code
          }
        },
        { status: 500 }
      );
    }

    console.log('Total count:', totalCount);

    // Execute main query with pagination
    console.log('Executing main query with pagination...');
    const { data: staff, error } = await query
      .range(offset, offset + limit - 1)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Main query error details:', error);
      return NextResponse.json(
        { 
          error: 'Database query failed', 
          details: error.message,
          debug: {
            companyId: finalCompanyId,
            branchId,
            search,
            role,
            isActive,
            offset,
            limit,
            sqlState: error.code,
            sqlMessage: error.message,
            hint: error.hint
          }
        },
        { status: 500 }
      );
    }

    console.log('Staff found:', staff?.length || 0);
    
    // Add branch information to each staff member
    const staffWithBranchInfo = staff?.map(staffMember => ({
      ...staffMember,
      // Add branch details from the branch info we fetched separately
      branch_name: branchInfo.name,
      branch_code: branchInfo.code,
      branch_is_head_office: branchInfo.is_head_office,
      branch_city: branchInfo.city,
      branch_state: branchInfo.state,
      country: 'India' // Assuming country is always India, can be parameterized if needed
    })) || [];

    if (staffWithBranchInfo && staffWithBranchInfo.length > 0) {
      console.log('First staff member sample:', {
        id: staffWithBranchInfo[0].id,
        name: `${staffWithBranchInfo[0].first_name} ${staffWithBranchInfo[0].last_name}`,
        role: staffWithBranchInfo[0].role,
        email: staffWithBranchInfo[0].email,
        branch_name: staffWithBranchInfo[0].branch_name,
        branch_code: staffWithBranchInfo[0].branch_code
      });
    }

    // Calculate pagination metadata
    const totalPages = Math.ceil((totalCount || 0) / limit);
    const hasNextPage = page < totalPages;
    const hasPreviousPage = page > 1;

    const response = {
      success: true,
      staff: staffWithBranchInfo,
      pagination: {
        currentPage: page,
        totalPages,
        totalItems: totalCount || 0,
        hasNextPage,
        hasPreviousPage,
        itemsPerPage: limit
      },
      branchInfo: {
        branchId: branchInfo.id,
        branchName: branchInfo.name,
        branchCode: branchInfo.code,
        isHeadOffice: branchInfo.is_head_office,
        companyId: branchInfo.company_id
      },
      debug: {
        queryExecuted: true,
        staffCount: staffWithBranchInfo?.length || 0,
        totalCount,
        filters: { search, role, isActive },
        pagination: { page, limit, offset },
        companyIdUsed: finalCompanyId,
        companyIdProvided: !!companyId,
        branchFound: true
      }
    };

    console.log('Returning response:', {
      success: response.success,
      staffCount: response.staff?.length,
      totalItems: response.pagination?.totalItems
    });

    return NextResponse.json(response);

  } catch (error) {
    console.error('API error:', error);
    return NextResponse.json(
      { 
        error: 'Internal server error', 
        details: error.message,
        stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
      },
      { status: 500 }
    );
  }
}