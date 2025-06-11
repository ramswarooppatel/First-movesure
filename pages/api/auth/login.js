import { AuthService } from '@/services/authService';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { identifier, password, deviceInfo = {} } = req.body;

    if (!identifier || !password) {
      return res.status(400).json({ 
        success: false,
        error: 'Identifier and password are required' 
      });
    }

    // Get device info from headers and request
    const userAgent = req.headers['user-agent'] || '';
    const deviceId = req.headers['x-device-id'] || deviceInfo.deviceId;
    
    const enrichedDeviceInfo = {
      ...deviceInfo,
      ip_address: req.headers['x-forwarded-for'] || req.connection.remoteAddress,
      user_agent: userAgent,
      device_id: deviceId,
      device_type: getDeviceType(userAgent),
      browser: getBrowser(userAgent),
      os: getOS(userAgent),
      timestamp: new Date().toISOString()
    };

    console.log('Login API: Attempting login for:', identifier);

    const result = await AuthService.login(identifier, password, enrichedDeviceInfo);

    if (result.success) {
      console.log('Login API: Login successful for user:', result.user.id);
      
      // Return consistent response structure
      res.status(200).json({
        success: true,
        user: result.user,
        accessToken: result.tokens.accessToken,
        refreshToken: result.tokens.refreshToken,
        sessionToken: result.tokens.sessionToken,
        message: 'Login successful'
      });
    } else {
      console.log('Login API: Login failed:', result.error);
      
      res.status(401).json({
        success: false,
        error: result.error
      });
    }
  } catch (error) {
    console.error('Login API: Unexpected error:', error);
    res.status(500).json({ 
      success: false,
      error: 'Internal server error' 
    });
  }
}

// Helper functions for device detection
function getDeviceType(userAgent) {
  if (/mobile/i.test(userAgent)) return 'mobile';
  if (/tablet/i.test(userAgent)) return 'tablet';
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