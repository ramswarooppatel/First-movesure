import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';
import { AuthUtils } from '@/utils/auth';
import bcrypt from 'bcryptjs';

// GET staff list
export async function GET(request) {
  try {
    console.log('Staff API: Request received');
    
    const authHeader = request.headers.get('authorization');
    console.log('Staff API: Auth header exists:', !!authHeader);
    console.log('Staff API: Auth header value:', authHeader ? `Bearer ${authHeader.split(' ')[1]?.substring(0, 10)}...` : 'None');
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      console.error('Staff API: No valid authorization header');
      return NextResponse.json({ error: 'No token provided' }, { status: 401 });
    }

    const token = authHeader.split(' ')[1];
    
    if (!token) {
      console.error('Staff API: Token is empty');
      return NextResponse.json({ error: 'Invalid token format' }, { status: 401 });
    }

    console.log('Staff API: Verifying token...');
    const decoded = AuthUtils.verifyToken(token);
    
    if (!decoded) {
      console.error('Staff API: Token verification failed');
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
    }

    console.log('Staff API: Token verified for user:', decoded.userId);
    
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '12'); // Changed to 12
    const search = searchParams.get('search') || '';
    const branch = searchParams.get('branch') || '';
    const role = searchParams.get('role') || '';
    const status = searchParams.get('status') || 'all';
    const department = searchParams.get('department') || '';

    const { userId } = decoded;

    // Get user's company
    const { data: userData, error: userError } = await supabaseAdmin
      .from('users')
      .select('company_id')
      .eq('id', userId)
      .single();

    if (userError || !userData) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Build main query
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
      .eq('company_id', userData.company_id);

    // Build count query with same filters
    let countQuery = supabaseAdmin
      .from('users')
      .select('*', { count: 'exact', head: true })
      .eq('company_id', userData.company_id);

    // Apply filters to both queries
    if (search.trim()) {
      const searchFilter = `first_name.ilike.%${search}%,last_name.ilike.%${search}%,email.ilike.%${search}%,phone.ilike.%${search}%,designation.ilike.%${search}%,username.ilike.%${search}%`;
      query = query.or(searchFilter);
      countQuery = countQuery.or(searchFilter);
    }

    if (branch) {
      query = query.eq('branch_id', branch);
      countQuery = countQuery.eq('branch_id', branch);
    }

    if (role) {
      query = query.eq('role', role);
      countQuery = countQuery.eq('role', role);
    }

    if (status !== 'all') {
      const isActive = status === 'active';
      query = query.eq('is_active', isActive);
      countQuery = countQuery.eq('is_active', isActive);
    }

    if (department) {
      query = query.ilike('department', `%${department}%`);
      countQuery = countQuery.ilike('department', `%${department}%`);
    }

    // Get total count first
    const { count, error: countError } = await countQuery;
    
    if (countError) {
      console.error('Count query error:', countError);
      throw countError;
    }

    console.log('Total staff count:', count);

    // Get aggregated stats for all staff (not just current page)
    let statsQuery = supabaseAdmin
      .from('users')
      .select('is_active, role')
      .eq('company_id', userData.company_id);

    // Apply same filters to stats query
    if (search.trim()) {
      const searchFilter = `first_name.ilike.%${search}%,last_name.ilike.%${search}%,email.ilike.%${search}%,phone.ilike.%${search}%,designation.ilike.%${search}%,username.ilike.%${search}%`;
      statsQuery = statsQuery.or(searchFilter);
    }

    if (branch) {
      statsQuery = statsQuery.eq('branch_id', branch);
    }

    if (role) {
      statsQuery = statsQuery.eq('role', role);
    }

    if (status !== 'all') {
      const isActive = status === 'active';
      statsQuery = statsQuery.eq('is_active', isActive);
    }

    if (department) {
      statsQuery = statsQuery.ilike('department', `%${department}%`);
    }

    const { data: statsData, error: statsError } = await statsQuery;

    if (statsError) {
      console.error('Stats query error:', statsError);
    }

    // Calculate aggregated stats
    const aggregatedStats = {
      total: count || 0,
      active: statsData ? statsData.filter(s => s.is_active).length : 0,
      admins: statsData ? statsData.filter(s => ['super_admin', 'admin'].includes(s.role)).length : 0,
      managers: statsData ? statsData.filter(s => s.role === 'branch_manager').length : 0
    };

    // Apply pagination and ordering to main query
    const offset = (page - 1) * limit;
    const { data: staff, error } = await query
      .range(offset, offset + limit - 1)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Staff query error:', error);
      return NextResponse.json({ error: 'Failed to fetch staff' }, { status: 500 });
    }

    console.log('Returning staff data:', {
      success: true,
      data: staff || [],
      total: count || 0,
      page,
      limit,
      totalPages: Math.ceil((count || 0) / limit),
      stats: aggregatedStats
    });

    return NextResponse.json({
      success: true,
      data: staff || [],
      total: count || 0,
      page,
      limit,
      totalPages: Math.ceil((count || 0) / limit),
      stats: aggregatedStats
    });

  } catch (error) {
    console.error('Get staff error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// Enhanced CREATE staff member
export async function POST(request) {
  try {
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

    // Get user's company
    const { data: userData, error: userError } = await supabaseAdmin
      .from('users')
      .select('company_id, role')
      .eq('id', userId)
      .single();

    if (userError || !userData) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    console.log('🆕 Creating new staff member:', { staffData });

    // Enhanced validation
    const requiredFields = ['first_name', 'last_name', 'email', 'phone', 'role', 'password'];
    for (const field of requiredFields) {
      if (!staffData[field]) {
        return NextResponse.json({ 
          error: `${field.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())} is required` 
        }, { status: 400 });
      }
    }

    // Validation for verification requirements
    if (!staffData.email_verified) {
      return NextResponse.json({ 
        error: 'Email verification is required before creating staff member' 
      }, { status: 400 });
    }

    if (!staffData.phone_verified) {
      return NextResponse.json({ 
        error: 'Phone verification is required before creating staff member' 
      }, { status: 400 });
    }

    // If PAN is provided, it must be verified
    if (staffData.pan_number && !staffData.pan_verified) {
      return NextResponse.json({ 
        error: 'PAN verification is required if PAN number is provided' 
      }, { status: 400 });
    }

    // If Aadhaar is provided, it must be verified
    if (staffData.aadhar_number && !staffData.aadhar_verified) {
      return NextResponse.json({ 
        error: 'Aadhaar verification is required if Aadhaar number is provided' 
      }, { status: 400 });
    }

    // Check if email/phone/username already exists in the company
    const { data: existingUser } = await supabaseAdmin
      .from('users')
      .select('id, email, phone, username')
      .eq('company_id', userData.company_id)
      .or(`email.eq.${staffData.email},phone.eq.${staffData.phone}${staffData.username ? `,username.eq.${staffData.username}` : ''}`)
      .single();

    if (existingUser) {
      let conflictField = '';
      if (existingUser.email === staffData.email) conflictField = 'Email';
      else if (existingUser.phone === staffData.phone) conflictField = 'Phone';
      else if (existingUser.username === staffData.username) conflictField = 'Username';
      
      return NextResponse.json({ 
        error: `${conflictField} already exists in your company` 
      }, { status: 400 });
    }

    // Hash password
    const saltRounds = 12;
    const hashedPassword = await bcrypt.hash(staffData.password, saltRounds);

    // Generate username if not provided
    let username = staffData.username;
    if (!username) {
      const baseUsername = (staffData.first_name + staffData.last_name).toLowerCase().replace(/\s+/g, '');
      let counter = 1;
      let uniqueUsername = baseUsername;
      
      // Check for username uniqueness
      while (true) {
        const { data: existingUsername } = await supabaseAdmin
          .from('users')
          .select('id')
          .eq('username', uniqueUsername)
          .eq('company_id', userData.company_id)
          .single();
          
        if (!existingUsername) {
          username = uniqueUsername;
          break;
        }
        
        uniqueUsername = `${baseUsername}${counter}`;
        counter++;
      }
    }

    // Validate branch exists and belongs to company
    if (staffData.branch_id) {
      const { data: branchData, error: branchError } = await supabaseAdmin
        .from('branches')
        .select('id, company_id')
        .eq('id', staffData.branch_id)
        .eq('company_id', userData.company_id)
        .single();

      if (branchError || !branchData) {
        return NextResponse.json({ 
          error: 'Invalid branch selection' 
        }, { status: 400 });
      }
    }

    // Create the staff member according to schema
    const { data: newStaff, error: createError } = await supabaseAdmin
      .from('users')
      .insert({
        // Required fields
        company_id: userData.company_id,
        phone: staffData.phone,
        
        // Account credentials
        username: username,
        email: staffData.email,
        password_hash: hashedPassword,
        
        // Verification status
        phone_verified: staffData.phone_verified || false,
        
        // Personal information
        first_name: staffData.first_name,
        last_name: staffData.last_name,
        middle_name: staffData.middle_name || null,
        date_of_birth: staffData.date_of_birth || null,
        gender: staffData.gender || null,
        
        // Identity documents (only if verified)
        aadhar_number: (staffData.aadhar_number && staffData.aadhar_verified) ? staffData.aadhar_number : null,
        pan_number: (staffData.pan_number && staffData.pan_verified) ? staffData.pan_number : null,
        
        // Professional information
        designation: staffData.designation || null,
        department: staffData.department || null,
        role: staffData.role,
        salary: staffData.salary ? parseFloat(staffData.salary) : null,
        joining_date: staffData.joining_date || new Date().toISOString().split('T')[0],
        
        // Address information
        address: staffData.address || null,
        city: staffData.city || null,
        state: staffData.state || null,
        pincode: staffData.pincode || null,
        
        // Emergency contact
        emergency_contact_name: staffData.emergency_contact_name || null,
        emergency_contact_phone: staffData.emergency_contact_phone || null,
        
        // Profile and settings
        profile_picture_url: staffData.profile_picture_url || null,
        language_preference: staffData.language_preference || 'en',
        
        // Assignment
        branch_id: staffData.branch_id || null,
        reporting_manager_id: staffData.reporting_manager_id || null,
        
        // Status
        is_active: staffData.is_active !== false,
        
        // Timestamps
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })
      .select(`
        *,
        branches:branch_id (
          id,
          name,
          is_head_office,
          code,
          city,
          state
        )
      `)
      .single();

    if (createError) {
      console.error('❌ Create staff error:', createError);
      return NextResponse.json({ error: createError.message }, { status: 500 });
    }

    console.log('✅ Staff member created successfully:', newStaff);

    // Update company staff count
    try {
      await supabaseAdmin.rpc('increment', { 
        table_name: 'companies', 
        column_name: 'staff_count', 
        row_id: userData.company_id 
      });
    } catch (countError) {
      console.error('Warning: Failed to update staff count:', countError);
      // Don't fail the main operation for this
    }

    return NextResponse.json({
      success: true,
      data: newStaff,
      message: 'Staff member created successfully'
    }, { status: 201 });

  } catch (error) {
    console.error('❌ Create staff error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}