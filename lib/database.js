import { supabaseAdmin } from './supabase'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { v4 as uuidv4 } from 'uuid'

export class DatabaseService {
  
  // Helper function to handle date values
  static formatDateValue(dateValue) {
    if (!dateValue || dateValue === '' || dateValue === 'null' || dateValue === 'undefined') {
      return null
    }
    
    try {
      const date = new Date(dateValue)
      if (isNaN(date.getTime())) {
        return null
      }
      return date.toISOString().split('T')[0] // Return YYYY-MM-DD format
    } catch (error) {
      return null
    }
  }

  // Create Company
  static async createCompany(companyData) {
    try {
      const { data, error } = await supabaseAdmin
        .from('companies')
        .insert({
          name: companyData.name,
          registration_number: companyData.registrationNumber,
          gst_number: companyData.gstNumber,
          pan_number: companyData.panNumber,
          email: companyData.email,
          phone: companyData.phone,
          website: companyData.website,
          address: companyData.address,
          city: companyData.city,
          state: companyData.state,
          country: companyData.country || 'India',
          pincode: companyData.pincode,
          language_pref: companyData.language || companyData.languagePreference || 'en',
          theme_pref: companyData.theme || companyData.themePreference || 'default',
          category: companyData.category,
          industry: companyData.industry,
          logo_url: companyData.logo,
          description: companyData.description,
          is_active: true
        })
        .select()
        .single()

      if (error) throw error
      return { success: true, data }
    } catch (error) {
      console.error('Error creating company:', error)
      return { success: false, error: error.message }
    }
  }

  // Create Branches
  static async createBranches(companyId, branchesData) {
    try {
      if (!branchesData || branchesData.length === 0) {
        return { success: true, data: [] }
      }

      const branches = branchesData.map(branch => ({
        company_id: companyId,
        name: branch.name,
        code: branch.code,
        address: branch.address || branch.fullAddress,
        city: branch.city,
        state: branch.state,
        country: branch.country || 'India',
        pincode: branch.pincode,
        phone: branch.phone,
        email: branch.email,
        is_head_office: branch.is_head_office || false,
        is_active: branch.is_active !== false,
        opening_time: branch.opening_time || '09:00',
        closing_time: branch.closing_time || '18:00',
        working_days: branch.working_days || 'Monday,Tuesday,Wednesday,Thursday,Friday,Saturday'
      }))

      const { data, error } = await supabaseAdmin
        .from('branches')
        .insert(branches)
        .select()

      if (error) throw error
      return { success: true, data }
    } catch (error) {
      console.error('Error creating branches:', error)
      return { success: false, error: error.message }
    }
  }

  // Create Users/Staff
  static async createUsers(companyId, branches, usersData) {
    try {
      if (!usersData || usersData.length === 0) {
        return { success: true, data: [] }
      }

      const users = []
      
      for (const userData of usersData) {
        // Hash password if provided
        const passwordHash = userData.password ? 
          await bcrypt.hash(userData.password, 12) : null

        // Find appropriate branch
        const userBranch = branches.find(b => 
          b.id === userData.branch_id || 
          (userData.role === 'super_admin' && b.is_head_office)
        ) || branches[0]

        // Clean and format date values
        const dateOfBirth = this.formatDateValue(userData.date_of_birth || userData.dateOfBirth)
        const joiningDate = this.formatDateValue(userData.joining_date || userData.joiningDate) || 
          new Date().toISOString().split('T')[0]

        const user = {
          company_id: companyId,
          branch_id: userBranch?.id || null,
          username: userData.username || userData.email,
          email: userData.email,
          phone: userData.phone,
          phone_verified: userData.phone_verified || false,
          password_hash: passwordHash,
          aadhar_number: userData.aadhar_number || userData.aadhaarNumber || null,
          pan_number: userData.pan_number || userData.panNumber || null,
          first_name: userData.first_name || userData.firstName || null,
          last_name: userData.last_name || userData.lastName || null,
          middle_name: userData.middle_name || userData.middleName || null,
          designation: userData.designation || null,
          department: userData.department || null,
          date_of_birth: dateOfBirth,
          gender: userData.gender || null,
          language_preference: userData.language_preference || 'en',
          address: userData.address || null,
          city: userData.city || null,
          state: userData.state || null,
          pincode: userData.pincode || null,
          emergency_contact_name: userData.emergency_contact_name || userData.emergencyContactName || null,
          emergency_contact_phone: userData.emergency_contact_phone || userData.emergencyContactPhone || null,
          profile_picture_url: userData.profile_picture_url || userData.photo || null,
          role: userData.role || 'branch_staff',
          salary: userData.salary ? parseFloat(userData.salary) : null,
          joining_date: joiningDate,
          reporting_manager_id: userData.reporting_manager_id || null,
          is_active: userData.is_active !== false
        }

        users.push(user)
      }

      console.log('Creating users with data:', users.map(u => ({
        username: u.username,
        email: u.email,
        role: u.role,
        date_of_birth: u.date_of_birth,
        joining_date: u.joining_date
      })))

      const { data, error } = await supabaseAdmin
        .from('users')
        .insert(users)
        .select()

      if (error) throw error
      return { success: true, data }
    } catch (error) {
      console.error('Error creating users:', error)
      return { success: false, error: error.message }
    }
  }

  // Update branch managers
  static async updateBranchManagers(branches, users) {
    try {
      if (!branches || !users || branches.length === 0 || users.length === 0) {
        return { success: true }
      }

      const updates = []
      
      for (const branch of branches) {
        const manager = users.find(u => 
          u.branch_id === branch.id && 
          (u.role === 'super_admin' || u.role === 'branch_manager')
        )
        
        if (manager) {
          updates.push({
            id: branch.id,
            manager_id: manager.id
          })
        }
      }

      if (updates.length > 0) {
        for (const update of updates) {
          await supabaseAdmin
            .from('branches')
            .update({ manager_id: update.manager_id })
            .eq('id', update.id)
        }
      }

      return { success: true }
    } catch (error) {
      console.error('Error updating branch managers:', error)
      return { success: false, error: error.message }
    }
  }

  // Update company counts
  static async updateCompanyCounts(companyId, branchCount, staffCount) {
    try {
      const { error } = await supabaseAdmin
        .from('companies')
        .update({
          branches_count: branchCount,
          staff_count: staffCount
        })
        .eq('id', companyId)

      if (error) throw error
      return { success: true }
    } catch (error) {
      console.error('Error updating company counts:', error)
      return { success: false, error: error.message }
    }
  }

  // Create access token
  static async createAccessToken(userId, deviceInfo = {}) {
    try {
      const token = jwt.sign(
        { userId, type: 'access' },
        process.env.JWT_SECRET,
        { expiresIn: '24h' }
      )

      const refreshToken = jwt.sign(
        { userId, type: 'refresh' },
        process.env.JWT_SECRET,
        { expiresIn: '7d' }
      )

      const { data, error } = await supabaseAdmin
        .from('access_tokens')
        .insert({
          user_id: userId,
          token: token,
          token_type: 'bearer',
          refresh_token: refreshToken,
          device_info: JSON.stringify(deviceInfo),
          ip_address: deviceInfo.ip_address,
          user_agent: deviceInfo.user_agent,
          expires_at: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
          is_revoked: false
        })
        .select()
        .single()

      if (error) throw error
      return { success: true, data: { ...data, token, refreshToken } }
    } catch (error) {
      console.error('Error creating access token:', error)
      return { success: false, error: error.message }
    }
  }

  // Create user session
  static async createUserSession(userId, deviceInfo = {}) {
    try {
      const sessionToken = uuidv4()
      
      const { data, error } = await supabaseAdmin
        .from('user_sessions')
        .insert({
          user_id: userId,
          session_token: sessionToken,
          device_id: deviceInfo.device_id,
          device_name: deviceInfo.device_name,
          is_active: true,
          expires_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString()
        })
        .select()
        .single()

      if (error) throw error
      return { success: true, data }
    } catch (error) {
      console.error('Error creating user session:', error)
      return { success: false, error: error.message }
    }
  }

  // Create login audit
  static async createLoginAudit(userId, deviceInfo = {}, status = 'success') {
    try {
      const { data, error } = await supabaseAdmin
        .from('login_audit')
        .insert({
          user_id: userId,
          ip_address: deviceInfo.ip_address,
          user_agent: deviceInfo.user_agent,
          device_type: deviceInfo.device_type,
          browser: deviceInfo.browser,
          os: deviceInfo.os,
          location_city: deviceInfo.location_city,
          location_country: deviceInfo.location_country,
          login_status: status,
          failure_reason: deviceInfo.failure_reason
        })
        .select()
        .single()

      if (error) throw error
      return { success: true, data }
    } catch (error) {
      console.error('Error creating login audit:', error)
      return { success: false, error: error.message }
    }
  }
}