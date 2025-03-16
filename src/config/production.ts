export const config = {
    apiUrl: process.env.REACT_APP_API_URL || 'https://api.yourdomain.com',
    pdfServiceUrl: process.env.REACT_APP_PDF_SERVICE_URL || 'https://pdf.yourdomain.com',
    emailServiceUrl: process.env.REACT_APP_EMAIL_SERVICE_URL || 'https://email.yourdomain.com',
    maxFileSize: 5 * 1024 * 1024, // 5MB
    supportedFileTypes: ['pdf', 'doc', 'docx', 'xls', 'xlsx'],
    dateFormat: 'MM/DD/YYYY',
    currency: 'USD',
    itemsPerPage: 10,
    maxItems: 50,
    invoicePrefix: 'INV-',
    companyInfo: {
        name: process.env.REACT_APP_COMPANY_NAME || 'Your Company Name',
        address: process.env.REACT_APP_COMPANY_ADDRESS || 'Your Company Address',
        phone: process.env.REACT_APP_COMPANY_PHONE || 'Your Company Phone',
        email: process.env.REACT_APP_COMPANY_EMAIL || 'your@email.com',
        website: process.env.REACT_APP_COMPANY_WEBSITE || 'www.yourcompany.com',
        taxId: process.env.REACT_APP_COMPANY_TAX_ID || 'Your Tax ID'
    }
}; 