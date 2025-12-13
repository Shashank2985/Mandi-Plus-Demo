const InsuranceForm = require('../models/InsuranceForm');
const auth = require('../middleware/auth');

// @desc    Create insurance form
// @route   POST /api/insurance/create
// @access  Private
const createInsuranceForm = async (req, res) => {
    try {
        const {
            supplierName,
            supplierAddress,
            placeOfSupply,
            buyerName,
            buyerAddress,
            itemName,
            hsn,
            quantity,
            rate,
            vehicleNumber,
            notes,
        } = req.body;

        // Calculate amount
        const amount = quantity * rate;

        // Handle file uploads
        let weightmentSlipURL = '';
        let pdfURL = '';

        if (req.files) {
            if (req.files.weightmentSlip) {
                weightmentSlipURL = req.files.weightmentSlip[0].path;
            }
            if (req.files.pdfFile) {
                pdfURL = req.files.pdfFile[0].path;
            }
        }

        const insuranceForm = new InsuranceForm({
            user: req.user.id,
            supplierName,
            supplierAddress,
            placeOfSupply,
            buyerName,
            buyerAddress,
            itemName,
            hsn,
            quantity,
            rate,
            amount,
            vehicleNumber,
            notes,
            weightmentSlipURL,
            pdfURL,
        });

        await insuranceForm.save();

        res.status(201).json({
            success: true,
            data: insuranceForm,
        });
    } catch (error) {
        console.error('Create insurance form error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error',
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