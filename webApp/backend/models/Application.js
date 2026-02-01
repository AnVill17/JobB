import mongoose from 'mongoose';

const applicationSchema = new mongoose.Schema({
    company: { type: String, required: true },
    jobTitle: { type: String, required: true },
    status: {
        type: String,
        enum: ['queued', 'analyzing', 'applied', 'rejected', 'interview'],
        default: 'queued',
    },
    dateApplied: { type: Date, default: Date.now },
    jobMatch: { type: String, required: true },
    coverLetter: { type: String },
    skillsMatch: { type: String },
    matchScore: { type: String },
    jobDescription: { type: String },
});

export default mongoose.model('Application', applicationSchema);