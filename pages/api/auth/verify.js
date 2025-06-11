import { AuthUtils } from '@/utils/auth';
import { createClient } from '@supabase/supabase-js';

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  }
);

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const authHeader = req.headers.authorization;
    const deviceId = req.headers['x-device-id'];
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ valid: false, error: 'No token provided' });
    }

    const token = authHeader.split(' ')[1];
    
    // Verify JWT token
    const decoded = AuthUtils.verifyToken(token);
    
    if (!decoded) {
      return res.status(401).json({ valid: false, error: 'Invalid token' });
    }

    // Check if token exists in database and is not revoked
    const { data: tokenData, error } = await supabaseAdmin
      .from('access_tokens')
      .select('is_revoked, expires_at, user_id')
      .eq('token', token)
      .single();

    if (error || !tokenData) {
      return res.status(401).json({ valid: false, error: 'Token not found' });
    }

    if (tokenData.is_revoked) {
      return res.status(401).json({ valid: false, error: 'Token revoked' });
    }

    if (new Date(tokenData.expires_at) < new Date()) {
      return res.status(401).json({ valid: false, error: 'Token expired' });
    }

    // Verify user is still active
    const { data: userData, error: userError } = await supabaseAdmin
      .from('users')
      .select('id, is_active')
      .eq('id', decoded.userId)
      .eq('is_active', true)
      .single();

    if (userError || !userData) {
      return res.status(401).json({ valid: false, error: 'User not found or inactive' });
    }

    res.status(200).json({ 
      valid: true, 
      userId: decoded.userId,
      deviceId 
    });
  } catch (error) {
    console.error('Token verification error:', error);
    res.status(401).json({ valid: false, error: 'Token verification failed' });
  }
}