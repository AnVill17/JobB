import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url'; // Required to recreate __dirname

// Import your custom modules (Remember the .js extension!)
import connectDB from '../config/db.js';
import applicationRoutes from '../routes/applicationRoutes.js';
import uploadRoutes from '../routes/uploadRoutes.js';

dotenv.config();

// --- 1. Fix __dirname for ES6 Modules ---
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5000;

// --- 2. Database Connection ---
connectDB();

// --- 3. Middleware ---
app.use(cors({ origin: 'http://localhost:5173' })); // Allow Vite Frontend
app.use(express.json());

// Serve the 'uploads' folder statically so PDFs can be viewed
// We use the recreated __dirname here
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// --- 4. Routes ---
// Note: Check your route prefixes!
// Typically, application routes go to /api/applications
app.use('/api/applications', applicationRoutes); 
app.use('/api', uploadRoutes); // This handles /api/upload and /api/mission/start

// --- 5. Error Handling ---
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send({ error: 'Something went wrong!', details: err.message });
});

app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
});