import multer from 'multer';
import path from 'path';
import fs from 'fs';
import axios from 'axios';
import FormData from 'form-data'; 

// ... (Multer setup code stays exactly the same) ...
const uploadDir = 'uploads/';
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir);

const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, uploadDir),
    filename: (req, file, cb) => {
        const uniqueName = `${Date.now()}-${file.originalname.replace(/\s+/g, '-')}`;
        cb(null, uniqueName);
    },
});

const fileFilter = (req, file, cb) => {
    if (file.mimetype === 'application/pdf') cb(null, true);
    else cb(new Error('Only .pdf files are allowed!'), false);
};

const upload = multer({ storage, fileFilter, limits: { fileSize: 5 * 1024 * 1024 } });

// --- EXPORTS ---

export const uploadMiddleware = upload.single('resume');

// Step 1: Handle the File Upload
export const handleUpload = (req, res) => {
    if (!req.file) return res.status(400).json({ error: "No file uploaded" });
    
    // Return the path so frontend can send it back later
    res.status(200).json({ 
        message: "Upload successful",
        filePath: req.file.path // e.g., "uploads/17000000-resume.pdf"
    });
};

// Step 2: Start Mission (JSON Only)
export const startAgentMission = async (req, res) => {
    // 1. Get data from JSON body
    const { preferences, userId, resumePath } = req.body;

    if (!resumePath) {
        return res.status(400).json({ error: "resumePath is missing. Upload resume first." });
    }

    // 2. Validate the file actually exists on our server
    if (!fs.existsSync(resumePath)) {
        return res.status(404).json({ error: "Resume file not found. Please upload again." });
    }

    try {
        console.log(`[Backend] 🚀 Starting mission for user: ${userId}`);

        // --- TODO: INTEGRATE LANGGRAPH AGENT HERE ---
        const formData = new FormData();
        
        // Read the file from disk using the path provided by Frontend
        formData.append('resume', fs.createReadStream(resumePath)); 
        formData.append('userId', userId);
        formData.append('config', JSON.stringify(preferences)); // Ensure it's a string
        formData.append('callbackUrl', 'http://localhost:5000/api/applications');

        const PYTHON_AGENT_URL = process.env.PYTHON_AGENT_URL || 'http://localhost:8000/start-workflow';

        /* UNCOMMENT TO CONNECT
        await axios.post(PYTHON_AGENT_URL, formData, {
            headers: { ...formData.getHeaders() },
        });
        */

        res.status(200).json({ 
            message: "Agent mission started successfully", 
            missionId: Date.now()
        });

    } catch (error) {
        console.error("❌ Failed to start agent:", error.message);
        res.status(500).json({ error: "Failed to trigger AI Agent" });
    }
};