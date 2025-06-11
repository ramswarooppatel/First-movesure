import { supabaseAdmin } from '@/lib/supabase';
import { AuthUtils } from '@/utils/auth';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, error: 'Method not allowed' });
  }

  try {
    // Authenticate user
    const userData = await AuthUtils.authenticateUser(req);
    if (!userData.success) {
      return res.status(401).json({ success: false, error: userData.error });
    }

    // Get the file from the request body (base64 encoded)
    const { fileData, fileName } = req.body;
    
    if (!fileData) {
      return res.status(400).json({ success: false, error: 'No file data provided' });
    }

    // Convert base64 to buffer
    const buffer = Buffer.from(fileData, 'base64');

    // Validate file size (5MB limit)
    if (buffer.length > 5 * 1024 * 1024) {
      return res.status(400).json({ success: false, error: 'File size exceeds 5MB limit' });
    }

    let jsonData = [];

    // Check file type and parse accordingly
    if (fileName.match(/\.(xlsx|xls)$/i)) {
      // Try to parse as Excel
      try {
        const XLSX = await import('xlsx');
        const workbook = XLSX.read(buffer, { type: 'buffer' });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        jsonData = XLSX.utils.sheet_to_json(worksheet);
      } catch (xlsxError) {
        console.error('XLSX parsing failed:', xlsxError);
        return res.status(400).json({ success: false, error: 'Failed to parse Excel file. Please use CSV format.' });
      }
    } else if (fileName.match(/\.csv$/i)) {
      // Parse as CSV
      try {
        const csvContent = buffer.toString('utf8');
        const lines = csvContent.split('\n').filter(line => line.trim() && !line.startsWith('#'));
        
        if (lines.length < 2) {
          return res.status(400).json({ success: false, error: 'CSV file must have at least a header and one data row' });
        }

        const headers = lines[0].split(',').map(h => h.trim().replace(/"/g, ''));
        jsonData = lines.slice(1).map(line => {
          const values = line.split(',').map(v => v.trim().replace(/"/g, ''));
          const row = {};
          headers.forEach((header, index) => {
            row[header] = values[index] || '';
          });
          return row;
        }).filter(row => row.first_name || row.last_name || row.email); // Filter empty rows
      } catch (csvError) {
        console.error('CSV parsing failed:', csvError);
        return res.status(400).json({ success: false, error: 'Failed to parse CSV file' });
      }
    } else {
      return res.status(400).json({ success: false, error: 'Invalid file type. Only Excel (.xlsx, .xls) or CSV files are allowed.' });
    }

    if (jsonData.length === 0) {
      return res.status(400).json({ success: false, error: 'File is empty or contains no valid data' });
    }

    // Get company branches for validation
    const { data: branches } = await supabaseAdmin
      .from('branches')
      .select('id, name')
      .eq('company_id', userData.user.company_id);

    const results = {
      total: jsonData.length,
      created: 0,
      failed: 0,
      errors: []
    };

    // Process each row (rest of the processing logic remains the same)
    for (let i = 0; i < jsonData.length; i++) {
      const row = jsonData[i];
      const rowNum = i + 2; // Row number (accounting for header)

      try {
        // Validate required fields
        const requiredFields = ['first_name', 'last_name', 'email', 'phone', 'role'];
        const missingFields = requiredFields.filter(field => !row[field]);
        
        if (missingFields.length > 0) {
          throw new Error(`Missing required fields: ${missingFields.join(', ')}`);
        }

        // Validate email format
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(row.email)) {
          throw new Error('Invalid email format');
        }

        // Validate phone format
        const phoneRegex = /^[\+]?[1-9][\d]{8,14}$/;
        if (!phoneRegex.test(row.phone?.replace(/\s+/g, ''))) {
          throw new Error('Invalid phone format');
        }

        // Validate role
        const validRoles = ['super_admin', 'admin', 'branch_manager', 'branch_staff', 'viewer'];
        if (!validRoles.includes(row.role)) {
          throw new Error(`Invalid role. Must be one of: ${validRoles.join(', ')}`);
        }

        // Validate branch if provided
        let branchId = null;
        if (row.branch_id) {
          const branch = branches.find(b => b.id === row.branch_id || b.name === row.branch_id);
          if (!branch) {
            throw new Error('Invalid branch ID or name');
          }
          branchId = branch.id;
        }

        // Check if email/phone already exists
        const { data: existingUser } = await supabaseAdmin
          .from('users')
          .select('id')
          .eq('company_id', userData.user.company_id)
          .or(`email.eq.${row.email},phone.eq.${row.phone}`)
          .single();

        if (existingUser) {
          throw new Error('Email or phone already exists in your company');
        }

        // Generate default password if not provided
        const bcrypt = await import('bcryptjs');
        const defaultPassword = row.password || 'TempPass123!';
        const passwordHash = await bcrypt.hash(defaultPassword, 12);

        // Create user
        const { data: newUser, error } = await supabaseAdmin
          .from('users')
          .insert({
            company_id: userData.user.company_id,
            branch_id: branchId,
            username: row.username || row.email,
            email: row.email,
            phone: row.phone,
            phone_verified: false,
            password_hash: passwordHash,
            first_name: row.first_name,
            last_name: row.last_name,
            middle_name: row.middle_name || null,
            designation: row.designation || null,
            department: row.department || null,
            date_of_birth: row.date_of_birth || null,
            gender: row.gender || null,
            language_preference: row.language_preference || 'en',
            address: row.address || null,
            city: row.city || null,
            state: row.state || null,
            pincode: row.pincode || null,
            emergency_contact_name: row.emergency_contact_name || null,
            emergency_contact_phone: row.emergency_contact_phone || null,
            role: row.role,
            salary: row.salary ? parseFloat(row.salary) : null,
            joining_date: row.joining_date || new Date().toISOString().split('T')[0],
            reporting_manager_id: row.reporting_manager_id || null,
            aadhar_number: row.aadhar_number || null,
            pan_number: row.pan_number || null,
            is_active: row.is_active !== 'false' && row.is_active !== false,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          })
          .select()
          .single();

        if (error) {
          throw new Error(error.message);
        }

        results.created++;
      } catch (error) {
        results.failed++;
        results.errors.push({
          row: rowNum,
          data: row,
          message: error.message
        });
      }
    }

    return res.status(200).json({
      success: true,
      data: results,
      message: `Upload completed. ${results.created} staff members created, ${results.failed} failed.`
    });

  } catch (error) {
    console.error('File upload error:', error);
    return res.status(500).json({ 
      success: false, 
      error: error.message || 'Failed to upload file' 
    });
  }
}

export const config = {
  api: {
    bodyParser: {
      sizeLimit: '10mb',
    },
  },
}