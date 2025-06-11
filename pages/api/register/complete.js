import { createClient } from '@supabase/supabase-js'
import registrationService from '../../../app/services/registrationService'

// Initialize Supabase
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY
const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
})

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    const formData = req.body
    console.log('Received registration data:', JSON.stringify(formData, null, 2))

    // Validate the registration data
    const validation = registrationService.validateRegistrationData(formData)
    if (!validation.isValid) {
      return res.status(400).json({
        success: false,
        error: 'Validation failed',
        details: validation.errors
      })
    }

    // Process the registration
    const result = await registrationService.completeRegistration(formData)

    console.log('Registration completed successfully:', result)

    // Set secure HTTP-only cookies for authentication if auto-login succeeded
    if (result.authentication) {
      const { tokens, session } = result.authentication

      // Set HTTP-only cookies
      res.setHeader('Set-Cookie', [
        `accessToken=${tokens.accessToken}; HttpOnly; Secure; SameSite=Strict; Path=/; Max-Age=${24 * 60 * 60}`,
        `sessionToken=${session.sessionToken}; HttpOnly; Secure; SameSite=Strict; Path=/; Max-Age=${30 * 24 * 60 * 60}`,
        `refreshToken=${tokens.refreshToken}; HttpOnly; Secure; SameSite=Strict; Path=/; Max-Age=${30 * 24 * 60 * 60}`
      ])
    }

    res.status(201).json({
      success: true,
      message: result.message,
      data: {
        company: result.company,
        userCount: result.users?.length || 0,
        branchCount: result.branches?.length || 0,
        autoLogin: !!result.authentication,
        user: result.authentication?.user
      },
      auth: result.authentication ? {
        user: result.authentication.user,
        token: result.authentication.tokens.accessToken,
        refreshToken: result.authentication.tokens.refreshToken,
        sessionToken: result.authentication.session.sessionToken
      } : null
    })

  } catch (error) {
    console.error('Registration API error:', error)
    res.status(500).json({
      success: false,
      error: error.message || 'Registration failed'
    })
  }
}

// Helper functions for device detection
function getDeviceType(userAgent) {
  if (!userAgent) return 'unknown'
  if (/tablet|ipad|playbook|silk/i.test(userAgent)) return 'tablet'
  if (/mobile|iphone|ipod|android|blackberry|opera|mini|windows\sce|palm|smartphone|iemobile/i.test(userAgent)) return 'mobile'
  return 'desktop'
}

function getBrowser(userAgent) {
  if (!userAgent) return 'Unknown'
  if (userAgent.includes('Chrome')) return 'Chrome'
  if (userAgent.includes('Firefox')) return 'Firefox'
  if (userAgent.includes('Safari')) return 'Safari'
  if (userAgent.includes('Edge')) return 'Edge'
  return 'Unknown'
}

function getOS(userAgent) {
  if (!userAgent) return 'Unknown'
  if (userAgent.includes('Windows')) return 'Windows'
  if (userAgent.includes('Mac')) return 'macOS'
  if (userAgent.includes('Linux')) return 'Linux'
  if (userAgent.includes('Android')) return 'Android'
  if (userAgent.includes('iOS')) return 'iOS'
  return 'Unknown'
}