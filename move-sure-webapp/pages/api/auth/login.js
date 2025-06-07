import { AuthService } from '@/services/authService';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { identifier, password } = req.body;

    if (!identifier || !password) {
      return res.status(400).json({ error: 'Identifier and password are required' });
    }

    // Get device info
    const userAgent = req.headers['user-agent'] || '';
    const deviceInfo = {
      ip_address: req.headers['x-forwarded-for'] || req.connection.remoteAddress,
      user_agent: userAgent,
      device_type: getDeviceType(userAgent),
      browser: getBrowser(userAgent),
      os: getOS(userAgent)
    };

    const result = await AuthService.login(identifier, password, deviceInfo);

    if (result.success) {
      // Set cookies
      res.setHeader('Set-Cookie', [
        `accessToken=${result.tokens.accessToken}; HttpOnly; Secure; SameSite=Strict; Path=/; Max-Age=${24 * 60 * 60}`,
        `sessionToken=${result.tokens.sessionToken}; HttpOnly; Secure; SameSite=Strict; Path=/; Max-Age=${30 * 24 * 60 * 60}`,
        `refreshToken=${result.tokens.refreshToken}; HttpOnly; Secure; SameSite=Strict; Path=/; Max-Age=${30 * 24 * 60 * 60}`
      ]);

      res.status(200).json({
        success: true,
        user: result.user,
        message: 'Login successful'
      });
    } else {
      res.status(401).json({
        success: false,
        error: result.error
      });
    }
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}

// Helper functions
function getDeviceType(userAgent) {
  if (/mobile|android|iphone/i.test(userAgent)) return 'mobile';
  if (/tablet|ipad/i.test(userAgent)) return 'tablet';
  return 'desktop';
}

function getBrowser(userAgent) {
  if (userAgent.includes('Chrome')) return 'Chrome';
  if (userAgent.includes('Firefox')) return 'Firefox';
  if (userAgent.includes('Safari')) return 'Safari';
  if (userAgent.includes('Edge')) return 'Edge';
  return 'Unknown';
}

function getOS(userAgent) {
  if (userAgent.includes('Windows')) return 'Windows';
  if (userAgent.includes('Mac')) return 'macOS';
  if (userAgent.includes('Linux')) return 'Linux';
  if (userAgent.includes('Android')) return 'Android';
  if (userAgent.includes('iOS')) return 'iOS';
  return 'Unknown';
}