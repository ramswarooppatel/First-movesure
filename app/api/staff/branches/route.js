import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';
import { AuthUtils } from '@/utils/auth';

export async function GET(request) {
  try {
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
      .select('company_id')
      .eq('id', userId)
      .single();

    if (userError || !userData) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Get branches for the company
    const { data, error } = await supabaseAdmin
      .from('branches')
      .select('*')
      .eq('company_id', userData.company_id)
      .eq('is_active', true)
      .order('is_head_office', { ascending: false })
      .order('name', { ascending: true });

    if (error) {
      throw error;
    }

    return NextResponse.json({
      success: true,
      data: data || []
    });

  } catch (error) {
    console.error('Get branches error:', error);
    return NextResponse.json({ 
      success: false, 
      error: 'Failed to fetch branches' 
    }, { status: 500 });
  }
}