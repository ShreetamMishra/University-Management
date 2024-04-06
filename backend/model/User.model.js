import mongoose from "mongoose";

export const UserSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    role: { type: String, required:  [true, "Please provide a role"] },
    email: {
        type: String,
        required: true,
        unique: true
    },
    registrationNumber: {
        type: String,
        required: false,
        unique: true
    },
    collegename: {
        type: String,
        required: false
    },
    password: {
        type: String,
        required: [true, "Please provide a password"],
        unique : false,
    },
    id: {
        type: String,
        required: false,
        unique: true
    },
});

export default mongoose.model('users', UserSchema);
