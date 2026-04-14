import mongoose from 'mongoose';

const feedbackSchema = new mongoose.Schema({
    goodPoints: String,
    missingPoints: String,
    score: Number
}, { _id: false });

const sessionSchema = new mongoose.Schema({
    name: { type: String, required: true },
    role: { type: String, required: true },
    difficulty: { type: String, required: true },
    questions: { type: [String], default: [] },
    answers: { type: [String], default: [] },
    feedbacks: { type: [feedbackSchema], default: [] },
    overallScore: { type: Number, default: 0 },
    summary: { type: String, default: '' },
    status: { type: String, enum: ['in-progress', 'completed'], default: 'in-progress' },
}, { timestamps: true });

const Session = mongoose.model('Session', sessionSchema);
export default Session;
