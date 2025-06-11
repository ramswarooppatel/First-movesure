import { supabaseAdmin } from '@/lib/supabase';
import { AuthUtils } from '@/utils/auth';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, error: 'Method not allowed' });
  }

  try {
    // Dynamic import for XLSX
    const XLSX = await import('xlsx');

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

    // Validate file extension
    if (!fileName.match(/\.(xlsx|xls)$/i)) {
      return res.status(400).json({ success: false, error: 'Invalid file type. Only Excel files are allowed.' });
    }

    const workbook = XLSX.read(buffer, { type: 'buffer' });
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];
    const jsonData = XLSX.utils.sheet_to_json(worksheet);

    if (jsonData.length === 0) {
      return res.status(400).json({ success: false, error: 'Excel file is empty' });
    }

    // Get existing emails and phones for validation
    const { data: existingUsers } = await supabaseAdmin
      .from('users')
      .select('email, phone')
      .eq('company_id', userData.user.company_id);

    const existingEmails = new Set(existingUsers.map(u => u.email));
    const existingPhones = new Set(existingUsers.map(u => u.phone));

    const validationResults = {
      total: jsonData.length,
      valid: 0,
      invalid: 0,
      errors: []
    };

    const requiredFields = ['first_name', 'last_name', 'email', 'phone', 'role'];
    const validRoles = ['super_admin', 'admin', 'branch_manager', 'branch_staff', 'viewer'];
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phoneRegex = /^[\+]?[1-9][\d]{8,14}$/;

    for (let i = 0; i < jsonData.length; i++) {
      const row = jsonData[i];
      const rowNum = i + 2;
      const rowErrors = [];

      // Check required fields
      const missingFields = requiredFields.filter(field => !row[field]);
      if (missingFields.length > 0) {
        rowErrors.push(`Missing required fields: ${missingFields.join(', ')}`);
      }

      // Validate email
      if (row.email && !emailRegex.test(row.email)) {
        rowErrors.push('Invalid email format');
      }

      // Validate phone
      if (row.phone && !phoneRegex.test(row.phone?.replace(/\s+/g, ''))) {
        rowErrors.push('Invalid phone format');
      }

      // Validate role
      if (row.role && !validRoles.includes(row.role)) {
        rowErrors.push(`Invalid role. Must be one of: ${validRoles.join(', ')}`);
      }

      // Check for duplicates
      if (row.email && existingEmails.has(row.email)) {
        rowErrors.push('Email already exists in company');
      }

      if (row.phone && existingPhones.has(row.phone)) {
        rowErrors.push('Phone already exists in company');
      }

      if (rowErrors.length > 0) {
        validationResults.invalid++;
        validationResults.errors.push({
          row: rowNum,
          message: rowErrors.join('; ')
        });
      } else {
        validationResults.valid++;
      }
    }

    return res.status(200).json({
      success: true,
      data: validationResults
    });

  } catch (error) {
    console.error('Validation error:', error);
    return res.status(500).json({ 
      success: false, 
      error: error.message || 'Failed to validate Excel file' 
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