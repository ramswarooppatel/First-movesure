// services/registrationService.js
import { supabaseAdmin } from '@/utils/supabase'
import { AuthUtils } from '@/utils/auth'
import jwt from 'jsonwebtoken'
import { v4 as uuidv4 } from 'uuid'

class RegistrationService {
  // Helper function to handle date values
  formatDateValue(dateValue) {
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

  // Create company with complete data
  async createCompany(companyData) {
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
          language_pref: companyData.language || 'en',
          theme_pref: companyData.theme || 'default',
          category: companyData.category,
          industry: companyData.industry,
          logo_url: companyData.logo, // Base64 or URL
          description: companyData.description,
          is_active: true
        })
        .select()
        .single()

      if (error) throw new Error(`Company creation failed: ${error.message}`)

      return data
    } catch (error) {
      throw error
    }
  }

  // Create branches
  async createBranches(companyId, branchesData) {
    try {
      if (!branchesData || branchesData.length === 0) {
        // Create a default head office branch
        const defaultBranch = {
          company_id: companyId,
          name: 'Head Office',
          code: 'HO001',
          is_head_office: true,
          is_active: true,
          opening_time: '09:00',
          closing_time: '18:00',
          working_days: 'Monday,Tuesday,Wednesday,Thursday,Friday,Saturday'
        }
        
        const { data, error } = await supabaseAdmin
          .from('branches')
          .insert([defaultBranch])
          .select()
        
        if (error) throw new Error(`Default branch creation failed: ${error.message}`)
        return data
      }

      const branchInserts = branchesData.map(branch => ({
        company_id: companyId,
        name: branch.name,
        code: branch.code,
        address: branch.address,
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
        .insert(branchInserts)
        .select()

      if (error) throw new Error(`Branches creation failed: ${error.message}`)

      return data
    } catch (error) {
      throw error
    }
  }

  // Create users (staff members) - Updated with password hashing
  async createUsers(companyId, staffData, branches) {
    try {
      if (!staffData || staffData.length === 0) {
        return []
      }

      const userInserts = []
      
      for (const staff of staffData) {
        // Hash password if provided
        const passwordHash = staff.password ? await AuthUtils.hashPassword(staff.password) : null

        // Find appropriate branch
        const assignedBranch = branches.find(b => 
          b.id === staff.branch_id || 
          (staff.role === 'super_admin' && b.is_head_office)
        ) || branches[0]

        // Clean and format date values
        const dateOfBirth = this.formatDateValue(staff.date_of_birth || staff.dateOfBirth)
        const joiningDate = this.formatDateValue(staff.joining_date || staff.joiningDate) || 
          new Date().toISOString().split('T')[0]

        userInserts.push({
          company_id: companyId,
          branch_id: assignedBranch?.id || null,
          username: staff.username || staff.email,
          email: staff.email,
          phone: staff.phone,
          phone_verified: staff.phone_verified || staff.phoneVerified || false,
          password_hash: passwordHash,
          aadhar_number: staff.aadhar_number || staff.aadhaarNumber || null,
          pan_number: staff.pan_number || staff.panNumber || null,
          first_name: staff.first_name || staff.firstName || null,
          last_name: staff.last_name || staff.lastName || null,
          middle_name: staff.middle_name || staff.middleName || null,
          designation: staff.designation || null,
          department: staff.department || null,
          date_of_birth: dateOfBirth,
          gender: staff.gender || null,
          language_preference: staff.language_preference || 'en',
          address: staff.address || null,
          city: staff.city || null,
          state: staff.state || null,
          pincode: staff.pincode || null,
          emergency_contact_name: staff.emergency_contact_name || staff.emergencyContactName || null,
          emergency_contact_phone: staff.emergency_contact_phone || staff.emergencyContactPhone || null,
          profile_picture_url: staff.profile_picture_url || staff.photo || null,
          role: staff.role || 'branch_staff',
          salary: staff.salary ? parseFloat(staff.salary) : null,
          joining_date: joiningDate,
          reporting_manager_id: staff.reporting_manager_id || null,
          is_active: staff.is_active !== false
        })
      }

      console.log('Creating users with data:', userInserts.map(u => ({
        username: u.username,
        email: u.email,
        role: u.role,
        date_of_birth: u.date_of_birth,
        joining_date: u.joining_date,
        has_password: !!u.password_hash
      })))

      const { data, error } = await supabaseAdmin
        .from('users')
        .insert(userInserts)
        .select()

      if (error) throw new Error(`Users creation failed: ${error.message}`)

      return data
    } catch (error) {
      throw error
    }
  }

  // Complete registration process
  async completeRegistration(formData) {
    try {
      console.log('Starting complete registration process...')
      console.log('Form data received:', JSON.stringify(formData, null, 2))

      // 1. Create company
      console.log('Creating company...')
      const company = await this.createCompany(formData.company)
      console.log('Company created:', company.id)

      // 2. Create branches
      console.log('Creating branches...')
      const branches = await this.createBranches(company.id, formData.branches || [])
      console.log('Branches created:', branches.length)

      // 3. Prepare staff data including owner
      const staffData = []
      
      // Add owner as super admin if provided
      if (formData.owner) {
        staffData.push({
          ...formData.owner,
          role: 'super_admin',
          designation: formData.owner.designation || 'Super Admin',
          department: formData.owner.department || 'Management'
        })
      }
      
      // Add additional staff
      if (formData.staff && formData.staff.length > 0) {
        staffData.push(...formData.staff.filter(s => s.role !== 'super_admin'))
      }

      // 4. Create users/staff
      console.log('Creating users...')
      const users = await this.createUsers(company.id, staffData, branches)
      console.log('Users created:', users.length)

      // 5. Setup reporting relationships
      console.log('Setting up reporting relationships...')
      await this.setupReportingRelationships(users)

      // 6. Update company counts
      console.log('Updating company counts...')
      await this.updateCompanyCounts(company.id, branches.length, users.length)

      // 7. Setup authentication for super admin
      console.log('Setting up authentication...')
      const authentication = await this.setupAuthentication(users.find(u => u.role === 'super_admin'))

      return {
        success: true,
        message: 'Registration completed successfully',
        company,
        branches,
        users,
        authentication
      }
    } catch (error) {
      console.error('Registration process failed:', error)
      throw error
    }
  }

  // Setup reporting relationships
  async setupReportingRelationships(users) {
    try {
      // Find super admin
      const superAdmin = users.find(u => u.role === 'super_admin')
      
      if (!superAdmin) return true

      // Update other users to report to super admin if no other manager is specified
      const updatePromises = users
        .filter(u => u.role !== 'super_admin' && !u.reporting_manager_id)
        .map(user => 
          supabaseAdmin
            .from('users')
            .update({ reporting_manager_id: superAdmin.id })
            .eq('id', user.id)
        )

      await Promise.all(updatePromises)
      return true
    } catch (error) {
      console.error('Error setting up reporting relationships:', error)
      return false
    }
  }

  // Update company counts
  async updateCompanyCounts(companyId, branchCount, userCount) {
    try {
      const { error } = await supabaseAdmin
        .from('companies')
        .update({
          branches_count: branchCount,
          staff_count: userCount
        })
        .eq('id', companyId)

      if (error) throw new Error(`Company count update failed: ${error.message}`)
    } catch (error) {
      throw error
    }
  }

  // Setup authentication for user
  async setupAuthentication(superAdmin) {
    if (!superAdmin) return null

    try {
      // Create JWT tokens
      const accessToken = jwt.sign(
        { userId: superAdmin.id, role: superAdmin.role },
        process.env.JWT_SECRET,
        { expiresIn: '24h' }
      )

      const refreshToken = jwt.sign(
        { userId: superAdmin.id, type: 'refresh' },
        process.env.JWT_SECRET,
        { expiresIn: '7d' }
      )

      // Create session token
      const sessionToken = uuidv4()

      // Store access token in database
      const { data: tokenData, error: tokenError } = await supabaseAdmin
        .from('access_tokens')
        .insert({
          user_id: superAdmin.id,
          token: accessToken,
          token_type: 'bearer',
          refresh_token: refreshToken,
          expires_at: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
          is_revoked: false
        })
        .select()
        .single()

      if (tokenError) {
        console.error('Token storage failed:', tokenError)
      }

      // Store user session
      const { data: sessionData, error: sessionError } = await supabaseAdmin
        .from('user_sessions')
        .insert({
          user_id: superAdmin.id,
          session_token: sessionToken,
          device_id: 'web-registration',
          device_name: 'Web Browser',
          is_active: true,
          expires_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString()
        })
        .select()
        .single()

      if (sessionError) {
        console.error('Session storage failed:', sessionError)
      }

      return {
        user: {
          id: superAdmin.id,
          email: superAdmin.email,
          username: superAdmin.username,
          role: superAdmin.role,
          company_id: superAdmin.company_id,
          branch_id: superAdmin.branch_id,
          first_name: superAdmin.first_name,
          last_name: superAdmin.last_name
        },
        tokens: {
          accessToken,
          refreshToken
        },
        session: {
          sessionToken
        }
      }
    } catch (error) {
      console.error('Authentication setup failed:', error)
      return null
    }
  }

  // Validation method
  validateRegistrationData(formData) {
    const errors = []

    // Validate company data
    if (!formData.company?.name) {
      errors.push('Company name is required')
    }

    // Validate owner data
    if (!formData.owner?.email) {
      errors.push('Owner email is required')
    }

    if (!formData.owner?.firstName) {
      errors.push('Owner first name is required')
    }

    if (!formData.owner?.phone) {
      errors.push('Owner phone number is required')
    }

    return {
      isValid: errors.length === 0,
      errors
    }
  }
}

const registrationService = new RegistrationService()
export default registrationService