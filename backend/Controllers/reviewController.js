const Review = require('../models/ReviewSchema.js');
const Doctor = require('../models/DoctorSchema.js');

module.exports = {
    getAllReviews: async (req, res) => {
        try {
            const reviews = await Review.find({})

            res.status(200).json({ success: true, message: 'Successful', data: reviews });
        } catch (err) {
            res.status(200).json({ success: false, message: 'Not found' });

        }
    },

    createReview: async (req, res) => {

        if (!req.body.doctor) req.body.doctor = req.params.doctorId;
        if (!req.body.user) req.body.user = req.userId;
        console.log(req.userId);
        const newReview = new Review(req.body);

        try {
            const savedReview = await newReview.save();

            await Doctor.findByIdAndUpdate(req.body.doctor, {
                $push: { reviews: savedReview._id },
            });

            res.status(200).json({ success: true, message: 'Review Submitted', data: savedReview });
        }
        catch (err) {
            res.status(500).json({ success: false, message: err.message });
        }

    }
}