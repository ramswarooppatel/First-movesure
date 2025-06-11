import { AuthUtils } from '@/utils/auth';
import { supabaseAdmin } from '@/lib/supabase';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const authHeader = req.headers.authorization;
    
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
      .select('is_revoked, expires_at')
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

    res.status(200).json({ valid: true, userId: decoded.userId });
  } catch (error) {
    console.error('Token verification error:', error);
    res.status(401).json({ valid: false, error: 'Token verification failed' });
  }
}