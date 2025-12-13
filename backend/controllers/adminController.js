const User = require('../models/User');
const InsuranceForm = require('../models/InsuranceForm');
const { verifyAdmin, generateAdminToken } = require('../middleware/adminAuth');

// @desc    Admin login
// @route   POST /api/admin/login
// @access  Public
const loginAdmin = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: 'Please provide email and password'
            });
        }

        if (!verifyAdmin(email, password)) {
            return res.status(401).json({
                success: false,
                message: 'Invalid credentials'
            });
        }

        const token = generateAdminToken();

        res.status(200).json({
            success: true,
            token,
            admin: {
                email: email,
                role: 'admin'
            }
        });

    } catch (error) {
        console.error('Admin login error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error during admin login',
            error: error.message
        });
    }
};

// @desc    Get all users
// @route   GET /api/admin/users
// @access  Private/Admin
const getAllUsers = async (req, res) => {
    try {
        const users = await User.aggregate([
            {
                $lookup: {
                    from: 'insuranceforms',
                    localField: '_id',
                    foreignField: 'user',
                    as: 'insuranceForms'
                }
            },
            {
                $project: {
                    mobileNumber: 1,
                    category: 1,
                    state: 1,
                    createdAt: 1,
                    totalForms: { $size: '$insuranceForms' }
                }
            },
            { $sort: { createdAt: -1 } }
        ]);

        res.status(200).json({
            success: true,
            count: users.length,
            data: users
        });

    } catch (error) {
        console.error('Get all users error:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching users',
            error: error.message
        });
    }
};

// @desc    Get all insurance forms
// @route   GET /api/admin/insurance-forms
// @access  Private/Admin
const getAllInsuranceForms = async (req, res) => {
    try {
        const forms = await InsuranceForm.find()
            .populate('user', 'mobileNumber category')
            .select('-__v')
            .sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            count: forms.length,
            data: forms
        });

    } catch (error) {
        console.error('Get all insurance forms error:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching insurance forms',
            error: error.message
        });
    }
};

// @desc    Get all insurance forms for a specific user
// @route   GET /api/admin/user/:userId/forms
// @access  Private/Admin
const getUserInsuranceForms = async (req, res) => {
    try {
        const { userId } = req.params;

        if (!mongoose.Types.ObjectId.isValid(userId)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid user ID'
            });
        }

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        const forms = await InsuranceForm.find({ user: userId })
            .select('-__v')
            .sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            count: forms.length,
            data: {
                user: {
                    mobileNumber: user.mobileNumber,
                    category: user.category,
                    state: user.state
                },
                forms
            }
        });

    } catch (error) {
        console.error('Get user insurance forms error:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching user insurance forms',
            error: error.message
        });
    }
};

module.exports = {
    loginAdmin,
    getAllUsers,
    getAllInsuranceForms,
    getUserInsuranceForms
};
