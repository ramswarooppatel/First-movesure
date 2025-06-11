import { AuthUtils } from '@/utils/auth';
import path from 'path';
import fs from 'fs';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ success: false, error: 'Method not allowed' });
  }

  try {
    const userData = await AuthUtils.authenticateUser(req);
    if (!userData.success) {
      return res.status(401).json({ success: false, error: userData.error });
    }

    // Path to static template file
    const templatePath = path.join(process.cwd(), 'public', 'templates', 'staff-upload-template.xlsx');
    
    // Check if file exists
    if (fs.existsSync(templatePath)) {
      const fileBuffer = fs.readFileSync(templatePath);
      
      res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
      res.setHeader('Content-Disposition', 'attachment; filename="staff-upload-template.xlsx"');
      res.setHeader('Content-Length', fileBuffer.length);
      
      return res.status(200).send(fileBuffer);
    } else {
      // Fallback to CSV
      const csvData = [
        'first_name,last_name,middle_name,email,phone,username,designation,department,role,branch_id,date_of_birth,gender,address,city,state,pincode,emergency_contact_name,emergency_contact_phone,salary,joining_date,reporting_manager_id,aadhar_number,pan_number,language_preference,is_active',
        'John,Doe,William,john.doe@company.com,+919876543210,john.doe,Software Engineer,Engineering,branch_staff,,1990-01-15,Male,"123 Main Street, Apartment 4B",Mumbai,Maharashtra,400001,Jane Doe,+919876543211,50000,2024-01-01,,123456789012,ABCDE1234F,en,true',
        'Jane,Smith,,jane.smith@company.com,+919876543212,jane.smith,Branch Manager,Management,branch_manager,,1988-05-20,Female,456 Business District,Delhi,Delhi,110001,John Smith,+919876543213,75000,2024-01-01,,987654321098,FGHIJ5678K,en,true'
      ].join('\n');

      res.setHeader('Content-Type', 'text/csv');
      res.setHeader('Content-Disposition', 'attachment; filename="staff-upload-template.csv"');
      return res.status(200).send(csvData);
    }

  } catch (error) {
    console.error('Template download error:', error);
    return res.status(500).json({ 
      success: false, 
      error: 'Failed to download template: ' + error.message 
    });
  }
}