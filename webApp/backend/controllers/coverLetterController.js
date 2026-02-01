// Dummy cover letter generator (replace with real logic)
export const generateCoverLetter = async (req, res) => {
    try {
        const { job, resumeHighlights } = req.body;
        if (!job || !resumeHighlights) {
            return res.status(400).json({ error: 'Missing job or resume highlights.' });
        }
        // TODO: Integrate real cover letter generation here
        // For now, just return a dummy cover letter
        res.json({
            coverLetter: `Dear ${job.company},\n\nI am excited to apply for the ${job.title} position. My experience includes: ${resumeHighlights.join(', ')}.\n\nSincerely,\nYour AI Agent`
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};
