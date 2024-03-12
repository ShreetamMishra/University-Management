// otpModel.js (example filename)
import mongoose from 'mongoose';

// Define the OTP schema
const otpSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
  },
  otp: {
    type: String,
    required: true,
  },
  // Other fields if needed
});

// Create the OTP model based on the schema
const OTPModel = mongoose.model('OTP', otpSchema);

export default OTPModel;
