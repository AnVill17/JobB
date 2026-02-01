import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Application from './models/Application.js';
dotenv.config();

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/aihactathon';

async function seedDemo() {
  await mongoose.connect(MONGO_URI);
  const demoApp = new Application({
    company: 'OpenAI',
    jobTitle: 'AI Research Engineer',
    status: 'applied',
    jobMatch: 'Resume Analysis: Demonstrates strong expertise in AI, deep learning, and NLP. Proven track record in research and deploying scalable models. Excellent problem-solving skills and a passion for innovation.',
    coverLetter: 'I am passionate about AI and have experience in deep learning and NLP.',
    skillsMatch: 'Python, Deep Learning, NLP, Research',
    matchScore: '92%',
    jobDescription: 'Work on cutting-edge AI research and deploy models at scale.',
  });
  await demoApp.save();
  console.log('Demo application seeded!');
  await mongoose.disconnect();
}

seedDemo();
