import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Application from './models/Application';

dotenv.config();

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log('MongoDB connected successfully');
    } catch (error) {
        console.error('MongoDB connection failed:', error.message);
        process.exit(1);
    }
};

const seedApplications = async () => {
    const applications = [
        {
            company: 'TechCorp',
            jobTitle: 'Software Engineer',
            status: 'queued',
            resumeUrl: '/uploads/techcorp-resume.pdf',
            coverLetter: 'I am excited to apply for the Software Engineer position at TechCorp.',
            jobDescription: 'Develop and maintain web applications.',
        },
        {
            company: 'Innovatech',
            jobTitle: 'Data Scientist',
            status: 'analyzing',
            resumeUrl: '/uploads/innovatech-resume.pdf',
            coverLetter: 'I am passionate about data science and would love to join Innovatech.',
            jobDescription: 'Analyze and interpret complex data.',
        },
        {
            company: 'FinTech Solutions',
            jobTitle: 'Backend Developer',
            status: 'applied',
            resumeUrl: '/uploads/fintech-resume.pdf',
            coverLetter: 'I am eager to contribute to FinTech Solutions as a Backend Developer.',
            jobDescription: 'Build and optimize backend systems.',
        },
        {
            company: 'HealthTech',
            jobTitle: 'Full Stack Developer',
            status: 'interview',
            resumeUrl: '/uploads/healthtech-resume.pdf',
            coverLetter: 'I am thrilled to apply for the Full Stack Developer role at HealthTech.',
            jobDescription: 'Develop and maintain full-stack applications.',
        },
        {
            company: 'EduTech',
            jobTitle: 'Frontend Developer',
            status: 'rejected',
            resumeUrl: '/uploads/edutech-resume.pdf',
            coverLetter: 'I am excited to bring my frontend skills to EduTech.',
            jobDescription: 'Design and implement user interfaces.',
        },
    ];

    try {
        await Application.insertMany(applications);
        console.log('Database seeded successfully');
        process.exit();
    } catch (error) {
        console.error('Error seeding database:', error.message);
        process.exit(1);
    }
};

const seed = async () => {
    await connectDB();
    await seedApplications();
};

seed();