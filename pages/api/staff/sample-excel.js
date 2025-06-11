import { AuthUtils } from '@/utils/auth';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ success: false, error: 'Method not allowed' });
  }

  try {
    const userData = await AuthUtils.authenticateUser(req);
    if (!userData.success) {
      return res.status(401).json({ success: false, error: userData.error });
    }

    // Create a comprehensive CSV template
    const csvHeaders = [
      'first_name',
      'last_name', 
      'middle_name',
      'email',
      'phone',
      'username',
      'designation',
      'department',
      'role',
      'branch_id',
      'date_of_birth',
      'gender',
      'address',
      'city',
      'state',
      'pincode',
      'emergency_contact_name',
      'emergency_contact_phone',
      'salary',
      'joining_date',
      'reporting_manager_id',
      'aadhar_number',
      'pan_number',
      'language_preference',
      'is_active'
    ];

    const sampleRows = [
      [
        'John',
        'Doe',
        'William',
        'john.doe@company.com',
        '+919876543210',
        'john.doe',
        'Software Engineer',
        'Engineering',
        'branch_staff',
        '', // branch_id - to be filled
        '1990-01-15',
        'Male',
        '123 Main Street, Apartment 4B',
        'Mumbai',
        'Maharashtra',
        '400001',
        'Jane Doe',
        '+919876543211',
        '50000',
        '2024-01-01',
        '', // reporting_manager_id - to be filled
        '123456789012',
        'ABCDE1234F',
        'en',
        'true'
      ],
      [
        'Jane',
        'Smith',
        '',
        'jane.smith@company.com',
        '+919876543212',
        'jane.smith',
        'Branch Manager',
        'Management',
        'branch_manager',
        '',
        '1988-05-20',
        'Female',
        '456 Business District',
        'Delhi',
        'Delhi',
        '110001',
        'John Smith',
        '+919876543213',
        '75000',
        '2024-01-01',
        '',
        '987654321098',
        'FGHIJ5678K',
        'en',
        'true'
      ],
      [
        'Mike',
        'Johnson',
        'Robert',
        'mike.johnson@company.com',
        '+919876543214',
        'mike.johnson',
        'Sales Executive',
        'Sales',
        'branch_staff',
        '',
        '1985-12-10',
        'Male',
        '789 Commercial Street',
        'Bangalore',
        'Karnataka',
        '560001',
        'Sarah Johnson',
        '+919876543215',
        '45000',
        '2024-01-01',
        '',
        '456789123456',
        'KLMNO9876P',
        'en',
        'true'
      ]
    ];

    // Create CSV content
    const csvContent = [
      csvHeaders.join(','),
      ...sampleRows.map(row => 
        row.map(field => {
          // Escape fields that contain commas, quotes, or newlines
          if (typeof field === 'string' && (field.includes(',') || field.includes('"') || field.includes('\n'))) {
            return `"${field.replace(/"/g, '""')}"`;
          }
          return field;
        }).join(',')
      )
    ].join('\n');

    // Add instructions as comments at the top
    const instructions = [
      '# STAFF UPLOAD TEMPLATE',
      '# REQUIRED FIELDS: first_name, last_name, email, phone, role',
      '# VALID ROLES: super_admin, admin, branch_manager, branch_staff, viewer',
      '# DATE FORMAT: YYYY-MM-DD (e.g., 1990-01-15)',
      '# PHONE FORMAT: Include country code (e.g., +919876543210)',
      '# BOOLEAN VALUES: true or false',
      '# EMAIL & PHONE: Must be unique within your company',
      '# BRANCH_ID: Get from your branch list or leave empty',
      '# SALARY: Numeric value only (e.g., 50000)',
      '# AADHAR: Exactly 12 digits',
      '# PAN: Format ABCDE1234F (5 letters + 4 digits + 1 letter)',
      '# Remove these instruction lines before uploading',
      '',
    ].join('\n');

    const finalContent = instructions + csvContent;

    // Set response headers for CSV download
    res.setHeader('Content-Type', 'text/csv; charset=utf-8');
    res.setHeader('Content-Disposition', 'attachment; filename="staff-upload-template.csv"');
    res.setHeader('Content-Length', Buffer.byteLength(finalContent, 'utf8'));

    return res.status(200).send(finalContent);

  } catch (error) {
    console.error('Sample template generation error:', error);
    return res.status(500).json({ 
      success: false, 
      error: 'Failed to generate sample template: ' + error.message 
    });
  }
}