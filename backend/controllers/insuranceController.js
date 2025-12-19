const InsuranceForm = require('../models/InsuranceForm');
const fs = require('fs');
const path = require('path');
const puppeteer = require('puppeteer');
const handlebars = require('handlebars');
const auth = require('../middleware/auth');

// Helper function to read file as base64
const fileToBase64 = (filePath) => {
    if (!filePath) return null;
    try {
        const fileData = fs.readFileSync(filePath);
        return `data:image/png;base64,${fileData.toString('base64')}`;
    } catch (error) {
        console.error('Error reading file:', error);
        return null;
    }
};

// Helper function to generate PDF
// ⚠️ ISSUE #7: No error handling for PDF generation failures
// Puppeteer can fail (browser launch, memory issues, etc.) but errors aren't caught here
// This could crash the server if PDF generation fails
const generatePDF = async (data) => {
    const templatePath = path.join(__dirname, '../templates/invoice.html');
    const templateContent = fs.readFileSync(templatePath, 'utf8');
    const template = handlebars.compile(templateContent);

    // Prepare data for template
    const templateData = {
        ...data,
        date: new Date().toLocaleDateString(),
        invoiceNumber: `INV-${Date.now()}`,
        amount: (data.quantity * data.rate).toFixed(2),
        weightmentSlip: data.weightmentSlipPath ? fileToBase64(data.weightmentSlipPath) : null,
        stampImage: fileToBase64(path.join(__dirname, '../public/stamp.png')) // Add your stamp image
    };

    const html = template(templateData);

    const browser = await puppeteer.launch({
        headless: 'new',
        args: ['--no-sandbox', '--disable-setuid-sandbox']
    });

    try {
        const page = await browser.newPage();
        await page.setContent(html, { waitUntil: 'networkidle0' });

        // Ensure all images are loaded
        await page.evaluate(async () => {
            const selectors = Array.from(document.querySelectorAll('img'));
            await Promise.all(selectors.map(img => {
                if (img.complete) return;
                return new Promise((resolve) => {
                    img.addEventListener('load', resolve);
                    img.addEventListener('error', resolve);
                });
            }));
        });

        const pdfBuffer = await page.pdf({
            format: 'A4',
            printBackground: true,
            margin: { top: '10mm', right: '10mm', bottom: '10mm', left: '10mm' }
        });

        return pdfBuffer;
    } finally {
        await browser.close();
    }
};

const createInsuranceForm = async (req, res) => {
    try {
        // ... (Destructuring inputs as before) ...
        const {
            supplierName, supplierAddress, placeOfSupply, buyerName,
            buyerAddress, itemName, hsn, quantity, rate, vehicleNumber, notes,
        } = req.body;

        // 1. Handle File Path
        // ⚠️ Use the manually saved path from our previous fix
        let weightmentSlipPath = '';
        let weightmentSlipURLForDB = '';

        if (req.file) {
            const uploadsDir = path.join(__dirname, '../uploads');
            if (!fs.existsSync(uploadsDir)) fs.mkdirSync(uploadsDir, { recursive: true });

            const extension = req.file.originalname.split('.').pop();
            const filename = `slip-${Date.now()}.${extension}`;
            weightmentSlipPath = path.join(uploadsDir, filename);

            fs.writeFileSync(weightmentSlipPath, req.file.buffer);
            weightmentSlipURLForDB = `/uploads/${filename}`;
        }

        // 2. Generate PDF with Specific Error Handling
        let pdfBuffer;
        try {
            pdfBuffer = await generatePDF({
                supplierName, supplierAddress, placeOfSupply, buyerName,
                buyerAddress, itemName, hsn,
                quantity: parseFloat(quantity),
                rate: parseFloat(rate),
                vehicleNumber, notes,
                weightmentSlipPath
            });
        } catch (pdfError) {
            console.error("CRITICAL: PDF Generation Failed", pdfError);
            // Return early with a specific error message so frontend knows what broke
            return res.status(500).json({
                success: false,
                message: "Failed to generate PDF invoice. Please ensure inputs are valid."
            });
        }

        // 3. Save PDF
        const pdfFileName = `insurance-${Date.now()}.pdf`;
        const pdfPath = path.join(__dirname, '../uploads', pdfFileName);

        try {
            fs.writeFileSync(pdfPath, pdfBuffer);
        } catch (fileError) {
            console.error("CRITICAL: File Write Failed", fileError);
            return res.status(500).json({
                success: false,
                message: "Failed to save generated PDF."
            });
        }

        // 4. Save to DB
        const insuranceForm = new InsuranceForm({
            user: req.user.id,
            supplierName, supplierAddress, placeOfSupply, buyerName,
            buyerAddress, itemName, hsn,
            quantity: parseFloat(quantity),
            rate: parseFloat(rate),
            amount: parseFloat(quantity) * parseFloat(rate),
            vehicleNumber, notes,
            weightmentSlipURL: weightmentSlipURLForDB,
            pdfURL: `/uploads/${pdfFileName}`,
        });

        await insuranceForm.save();

        res.status(201).json({
            success: true,
            data: {
                ...insuranceForm.toObject(),
                pdfURL: `/uploads/${pdfFileName}`
            }
        });

    } catch (error) {
        console.error('Create insurance form error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error: ' + error.message,
        });
    }
};

// @desc    Get user's insurance forms
// @route   GET /api/insurance/my-forms
// @access  Private
const getMyInsuranceForms = async (req, res) => {
    try {
        const insuranceForms = await InsuranceForm.find({ user: req.user.id }).sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            data: insuranceForms,
        });
    } catch (error) {
        console.error('Get insurance forms error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error',
        });
    }
};

module.exports = {
    createInsuranceForm,
    getMyInsuranceForms,
};