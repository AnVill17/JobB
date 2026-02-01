const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const { v4: uuidv4 } = require('uuid');

const app = express();
const PORT = 7001;


app.use(cors());
app.use(bodyParser.json());

// Hardcoded job feed
const jobs = Array.from({ length: 30 }, (_, index) => ({
  id: index + 1,
  title: `Job Title ${index + 1}`,
  company: `Company ${index + 1}`,
  location: ["Remote", "NYC", "SF", "Bangalore"][Math.floor(Math.random() * 4)],
  salary_range: `$${50000 + index * 1000} - $${60000 + index * 1000}`,
  description: `This is a description for Job Title ${index + 1}.`,
  required_skills: ["Python", "React", "C++", "Marketing", "Data Science"].sort(() => 0.5 - Math.random()).slice(0, 3),
}));


const applications_db = [];

// Endpoints


app.get('/api/jobs', (req, res) => {
  res.json(jobs);
});

// GET /api/jobs/:id: Returns details for a single job
app.get('/api/jobs/:id', (req, res) => {
  const jobId = parseInt(req.params.id, 10);
  const job = jobs.find((job) => job.id === jobId);
  if (job) {
    res.json(job);
  } else {
    res.status(404).json({ error: 'Job not found' });
  }
});

// POST /api/apply: Apply for a job
app.post('/api/apply', (req, res) => {
  const { student_id, job_id, resume_text, cover_letter } = req.body;

  if (!student_id || !job_id || !resume_text || !cover_letter) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  const job = jobs.find((job) => job.id === job_id);
  if (!job) {
    return res.status(404).json({ error: 'Job not found' });
  }

  // Simulate success or failure
  const isSuccess = Math.random() < 0.8;
  if (isSuccess) {
    const application_id = uuidv4();
    const timestamp = new Date().toISOString();
    applications_db.push({ student_id, job_id, resume_text, cover_letter, application_id, timestamp });
    console.log(`[MockPortal] 🟢 New Application for Job #${job_id}: Success`);
    res.status(200).json({ status: 'submitted', application_id });
  } else {
    const errorCode = Math.random() < 0.5 ? 500 : 429;
    console.log(`[MockPortal] 🔴 New Application for Job #${job_id}: Failed with error ${errorCode}`);
    res.status(errorCode).json({ error: 'Application failed. Please try again.' });
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});