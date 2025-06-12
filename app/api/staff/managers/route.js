import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';
import { AuthUtils } from '@/utils/auth';

export async function GET(request) {
  try {
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
    const { searchParams } = new URL(request.url);
    const branchId = searchParams.get('branch_id');
    const includeAll = searchParams.get('include_all') === 'true';

    console.log('Manager API - Parameters:', { branchId, includeAll, userId });

    // Get user's company
    const { data: userData, error: userError } = await supabaseAdmin
      .from('users')
      .select('company_id, role, branch_id')
      .eq('id', userId)
      .single();

    if (userError || !userData) {
      console.error('User fetch error:', userError);
      return NextResponse.json(
        { success: false, error: 'User not found' },
        { status: 404 }
      );
    }

    console.log('Manager API - User data:', userData);

    // Build base query for managers
    let query = supabaseAdmin
      .from('users')
      .select(`
        id,
        first_name,
        last_name,
        email,
        role,
        branch_id,
        designation,
        department,
        is_active,
        phone,
        branches:branch_id(
          id,
          name,
          code,
          is_head_office
        )
      `)
      .eq('company_id', userData.company_id)
      .eq('is_active', true)
      .in('role', ['super_admin', 'admin', 'branch_manager']);

    // Apply branch filtering logic
    if (branchId && branchId !== 'null') {
      try {
        // Validate UUID format
        const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
        if (!uuidRegex.test(branchId)) {
          throw new Error('Invalid UUID format for branch_id');
        }

        if (includeAll) {
          // Get managers from specific branch + super admins and admins (who can manage any branch)
          // Using OR condition for PostgreSQL
          query = query.or(`branch_id.eq.${branchId},role.in.(super_admin,admin)`);
        } else {
          // Get managers from specific branch only
          query = query.eq('branch_id', branchId);
        }
        
        console.log('Manager API - Applied branch filter:', { branchId, includeAll });
      } catch (error) {
        console.error('Branch ID validation error:', error);
        return NextResponse.json(
          { success: false, error: 'Invalid branch ID format' },
          { status: 400 }
        );
      }
    }

    // Add ordering
    query = query
      .order('role', { ascending: false }) // Super admin first, then admin, then branch manager
      .order('first_name');

    console.log('Manager API - Executing query...');

    const { data: managers, error } = await query;

    if (error) {
      console.error('Error fetching managers:', error);
      return NextResponse.json(
        { success: false, error: 'Failed to fetch managers', details: error.message },
        { status: 500 }
      );
    }

    console.log('Manager API - Raw managers data:', managers);

    // Format the response with enhanced data
    const formattedManagers = managers.map(manager => {
      const roleDisplayMap = {
        'super_admin': 'OWNER',
        'admin': 'Admin', 
        'branch_manager': 'Branch Manager'
      };

      const roleColorMap = {
        'super_admin': 'purple',
        'admin': 'blue',
        'branch_manager': 'green'
      };

      return {
        id: manager.id,
        first_name: manager.first_name,
        last_name: manager.last_name,
        full_name: `${manager.first_name || ''} ${manager.last_name || ''}`.trim(),
        email: manager.email,
        phone: manager.phone,
        role: manager.role,
        role_display: roleDisplayMap[manager.role] || manager.role,
        role_color: roleColorMap[manager.role] || 'gray',
        designation: manager.designation || roleDisplayMap[manager.role],
        department: manager.department,
        branch_id: manager.branch_id,
        branch_name: manager.branches?.name || 'No Branch Assigned',
        branch_code: manager.branches?.code || '',
        is_head_office: manager.branches?.is_head_office || false,
        can_manage_all_branches: ['super_admin', 'admin'].includes(manager.role),
        // Display label for dropdown
        display_label: `${manager.first_name || ''} ${manager.last_name || ''} (${roleDisplayMap[manager.role]})${manager.branches?.name ? ` - ${manager.branches.name}` : ''}`
      };
    });

    // Group managers by role for better organization
    const groupedManagers = {
      super_admin: formattedManagers.filter(m => m.role === 'super_admin'),
      admin: formattedManagers.filter(m => m.role === 'admin'),
      branch_manager: formattedManagers.filter(m => m.role === 'branch_manager')
    };

    // Statistics
    const stats = {
      total: formattedManagers.length,
      by_role: {
        super_admin: groupedManagers.super_admin.length,
        admin: groupedManagers.admin.length,
        branch_manager: groupedManagers.branch_manager.length
      },
      branch_specific: branchId ? formattedManagers.filter(m => 
        m.branch_id === branchId || ['super_admin', 'admin'].includes(m.role)
      ).length : 0
    };

    // Get branch information if branchId is provided
    let branchInfo = null;
    if (branchId && branchId !== 'null') {
      const { data: branch } = await supabaseAdmin
        .from('branches')
        .select('id, name, code, is_head_office')
        .eq('id', branchId)
        .eq('company_id', userData.company_id)
        .single();
      
      branchInfo = branch;
    }

    console.log('Manager API - Final response:', {
      managersCount: formattedManagers.length,
      stats,
      branchInfo
    });

    return NextResponse.json({
      success: true,
      data: formattedManagers,
      grouped: groupedManagers,
      stats,
      branch_info: branchInfo,
      filters: {
        branch_id: branchId,
        include_all: includeAll,
        company_id: userData.company_id
      },
      total: formattedManagers.length
    });

  } catch (error) {
    console.error('Managers API error:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Internal server error',
        details: process.env.NODE_ENV === 'development' ? error.message : undefined
      },
      { status: 500 }
    );
  }
}