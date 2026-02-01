import Application from '../models/Application.js';

// 1. Create a new application (Called by your Python Agent)
export const createApplication = async (req, res) => {
    try {
        // Log what we receive to help debug
        console.log("[Controller] Received payload:", req.body);

        // Destructure incoming data (handling different naming conventions)
        const { 
            company, 
            role,      // Python sends 'role'
            jobTitle,  // Schema wants 'jobTitle'
            status, 
            resumePath,          // Sometimes sent directly
            artifacts,           // Sometimes sent nested
            coverLetter 
        } = req.body;

        // MAP DATA TO SCHEMA FIELDS
        const newApp = new Application({
            company: company || "Unknown Company",
            
            // Map 'role' OR 'jobTitle' to the schema's 'jobTitle'
            jobTitle: jobTitle || role || "Unknown Role",
            
            status: status || 'queued',
            
            // Map the resume path (Handle both flat and nested structures)
            resumeUrl: resumePath || (artifacts?.resumePath) || "No Resume Provided",
            
            // Handle cover letter
            coverLetter: coverLetter || (artifacts?.coverLetter) || "",
        });

        const savedApp = await newApp.save();
        console.log("[Controller] ✅ Saved Application:", savedApp._id);
        res.status(201).json(savedApp);
        
    } catch (err) {
        console.error("❌ Error creating application:", err);
        // Return the specific error message so you know WHAT failed (e.g., "jobTitle is required")
        res.status(500).json({ error: "Failed to save application", details: err.message });
    }
};

// 2. Get all applications (Sorted by newest)
export const getApplications = async (req, res) => {
    try {
        const apps = await Application.find().sort({ dateApplied: -1 });
        res.json(apps);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// 3. Update Status (e.g., 'queued' -> 'applied')
// 3. Smart Update Status (Find by ID OR Company/Role)
export const updateApplicationStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status, company, role, jobTitle } = req.body;

        let query = {};

        // STRATEGY 1: If ID is provided in URL, use it (Fastest)
        if (id) {
            query = { _id: id };
        } 
        // STRATEGY 2: Search by Company & Role (Case-Insensitive)
        else if (company && (role || jobTitle)) {
            const titleToSearch = role || jobTitle;
            query = {
                company: new RegExp(`^${company}$`, 'i'), // 'google' matches 'Google'
                jobTitle: new RegExp(`^${titleToSearch}$`, 'i')
            };
        } 
        else {
            return res.status(400).json({ 
                error: "Target missing. Provide either an ':id' in the URL or 'company' and 'role' in the body." 
            });
        }

        console.log(`[Controller] 🔄 Updating status for query:`, query);

        // Find the MOST RECENT application matching criteria and update it
        const updatedApp = await Application.findOneAndUpdate(
            query, 
            { status: status },
            { new: true, sort: { dateApplied: -1 } } // Sort ensures we update the latest one if duplicates exist
        );

        if (!updatedApp) {
            return res.status(404).json({ error: "Application not found matching those details." });
        }

        console.log(`[Controller] ✅ Updated status to '${status}' for ${updatedApp.company}`);
        res.json(updatedApp);

    } catch (err) {
        console.error("❌ Update failed:", err);
        res.status(500).json({ error: err.message });
    }
};