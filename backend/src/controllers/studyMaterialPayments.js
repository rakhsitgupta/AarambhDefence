const Razorpay = require('razorpay');
const crypto = require('crypto');
const StudyMaterial = require('../../models/StudyMaterial');
const UserModel = require('../../models/user');

const instance = new Razorpay({
    key_id: process.env.RAZORPAY_KEY,
    key_secret: process.env.RAZORPAY_SECRET
});

exports.createOrder = async (req, res) => {
    try {
        const { materialId } = req.body;
        console.log('Creating order for material:', materialId);

        if (!materialId) {
            return res.status(400).json({
                success: false,
                message: 'Study material ID is required'
            });
        }

        // Find the study material
        const studyMaterial = await StudyMaterial.findById(materialId);
        if (!studyMaterial) {
            console.log('Study material not found:', materialId);
            return res.status(404).json({
                success: false,
                message: 'Study material not found'
            });
        }

        // Check if user is already enrolled
        if (studyMaterial.enrolledStudents.includes(req.user._id)) {
            console.log('User already enrolled:', req.user._id);
            return res.status(400).json({
                success: false,
                message: 'You are already enrolled in this study material'
            });
        }

        // Create Razorpay order with shorter receipt
        const options = {
            amount: studyMaterial.price * 100, // Convert to paise
            currency: 'INR',
            receipt: `sm_${materialId.slice(-6)}_${Date.now().toString().slice(-6)}`,
            notes: {
                materialId: materialId.toString(),
                userId: req.user._id.toString()
            }
        };

        const order = await instance.orders.create(options);
        console.log('Order created:', order.id);

        // Create a pending payment record in user's payments array
        const user = await UserModel.findById(req.user._id);
        user.payments.push({
            studyMaterialId: materialId,
            orderId: order.id,
            amount: studyMaterial.price,
            status: 'pending'
        });
        await user.save();

        res.status(200).json({
            success: true,
            data: {
                orderId: order.id,
                amount: order.amount,
                currency: order.currency
            }
        });
    } catch (error) {
        console.error('Error creating order:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to create order'
        });
    }
};

exports.verifyPayment = async (req, res) => {
    try {
        const { razorpay_order_id, razorpay_payment_id, razorpay_signature, materialId } = req.body;
        console.log('Payment verification request:', { razorpay_order_id, materialId, userId: req.user._id });

        if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature || !materialId) {
            return res.status(400).json({
                success: false,
                message: 'All payment verification fields are required'
            });
        }

        // Verify payment signature
        const body = razorpay_order_id + '|' + razorpay_payment_id;
        const expectedSignature = crypto
            .createHmac('sha256', process.env.RAZORPAY_SECRET)
            .update(body)
            .digest('hex');

        if (expectedSignature !== razorpay_signature) {
            // Update payment status to failed in user's payments array
            const user = await UserModel.findById(req.user._id);
            const payment = user.payments.find(p => p.orderId === razorpay_order_id);
            if (payment) {
                payment.status = 'failed';
                await user.save();
            }
            
            return res.status(400).json({
                success: false,
                message: 'Invalid payment signature'
            });
        }

        // Find the study material
        const studyMaterial = await StudyMaterial.findById(materialId);
        if (!studyMaterial) {
            console.log('Study material not found:', materialId);
            return res.status(404).json({
                success: false,
                message: 'Study material not found'
            });
        }

        // Check if user is already enrolled
        if (studyMaterial.enrolledStudents.includes(req.user._id)) {
            console.log('User already enrolled:', req.user._id);
            return res.status(400).json({
                success: false,
                message: 'You are already enrolled in this study material'
            });
        }

        // Update payment status to successful in user's payments array
        const user = await UserModel.findById(req.user._id);
        const payment = user.payments.find(p => p.orderId === razorpay_order_id);
        if (payment) {
            payment.status = 'successful';
            payment.paymentId = razorpay_payment_id;
            payment.paymentDate = new Date();
            await user.save();
        }

        // Add student to enrolled students
        studyMaterial.enrolledStudents.push(req.user._id);
        await studyMaterial.save();
        console.log('Added student to study material:', { materialId, userId: req.user._id });

        // Add study material to user's enrolled materials
        user.enrolledStudyMaterials.push(materialId);
        await user.save();
        console.log('Added study material to user:', { userId: req.user._id, materialId });

        res.status(200).json({
            success: true,
            message: 'Payment verified and enrollment successful'
        });
    } catch (error) {
        console.error('Error verifying payment:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to verify payment'
        });
    }
}; 