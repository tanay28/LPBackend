const mongoose = require('mongoose');

const otpSchema = new mongoose.Schema({
    otp: {
        type: String,
        require: true
    },
    phoneNo: {
        type: String,
        require: true
    },
    createdAt: { type: Date, default: Date.now, index: { expires:300 } }
});

module.exports = mongoose.model('OtpSchema', otpSchema,"otp");