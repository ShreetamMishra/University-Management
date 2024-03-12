import mongoose from 'mongoose';

const FacultySchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    role: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    id: {
        type: String,
        required: true,
        unique: true
    },
    collegename: {
        type: String,
        required: true
    }
});

export default mongoose.model('Facultymodel', FacultySchema);
