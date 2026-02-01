import { useState, useEffect, useCallback } from 'react';

// 1. FIXED INTERFACE: Added missing fields
export interface Job {
  id: string;
  company: string;
  title: string;
  location: string;
  salary: string;
  status: string;
  logo: string;
  appliedAt: Date;
  coverLetter?: string;
  skillsMatch?: string; // ✅ Added
  matchScore?: string;  // ✅ Added
}

export interface LogEntry {
  id: string;
  timestamp: Date;
  message: string;
  type: 'success' | 'error' | 'processing';
}

const mapBackendToJob = (app: any): Job => ({
  id: app._id || app.id,
  company: app.company || 'Unknown',
  title: app.jobTitle || app.role || 'Unknown Role',
  location: app.location || 'Remote',
  salary: app.salary || '$120k - $160k',
  status: app.status || 'queued',
  logo: app.logo || '🏢',
  appliedAt: app.createdAt ? new Date(app.createdAt) : new Date(),
  coverLetter: app.coverLetter || '',
  skillsMatch: app.skillsMatch || 'N/A', // ✅ Added with default
  matchScore: app.matchScore || 'N/A',   // ✅ Added with default
});

export const useAgentBackend = () => {
  // 1. Visible State
  const [jobs, setJobs] = useState<Job[]>([]);
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [stats, setStats] = useState({
    jobsScanned: 0,
    applicationsSent: 0,
    autoRejectCount: 0,
    successRate: 0,
  });

  // 2. Internal Buffer State
  const [jobQueue, setJobQueue] = useState<Job[]>([]);
  const [processedIds, setProcessedIds] = useState<Set<string>>(new Set());
  const [isProcessing, setIsProcessing] = useState(false);
  const [isRunning, setIsRunning] = useState(true);

  // 3. Fetch Data
  const fetchApplications = useCallback(async () => {
    try {
      // Updated to use Render backend
      const res = await fetch('https://jobb-a4is.onrender.com/api/applications');
      if (!res.ok) throw new Error('Failed to fetch');

      const rawApps = await res.json();
      const mappedApps = rawApps.map(mapBackendToJob);

      setProcessedIds((prevIds) => {
        const newQueue: Job[] = [];
        const newIds = new Set(prevIds);

        mappedApps.forEach((job: Job) => {
          if (!newIds.has(job.id)) {
            newQueue.push(job);
            newIds.add(job.id);
          }
        });

        if (newQueue.length > 0) {
          setJobQueue((prevQ) => [...prevQ, ...newQueue]);
        }
        return newIds;
      });
    } catch (err) {
      console.error('[Backend Hook] Fetch error:', err);
    }
  }, []);

  // 4. Processing Effect
  useEffect(() => {
    if (!isRunning || jobQueue.length === 0 || isProcessing) return;

    setIsProcessing(true);
    const nextJob = jobQueue[0];

    // Update UI
    setJobs((prev) => [nextJob, ...prev]);

    setLogs((prev) => {
      const newLog: LogEntry = {
        id: `log-${nextJob.id}-${Date.now()}`,
        timestamp: new Date(),
        message: `⚡ ${nextJob.status === 'queued' ? 'Analyzing' : 'Applied to'} ${nextJob.title} at ${nextJob.company}`,
        type: nextJob.status === 'applied' ? 'success' : 'processing',
      };
      return [newLog, ...prev].slice(0, 50);
    });

    setStats((prev) => ({
      ...prev,
      jobsScanned: prev.jobsScanned + 1,
      applicationsSent: nextJob.status === 'applied' ? prev.applicationsSent + 1 : prev.applicationsSent,
      autoRejectCount: nextJob.status === 'rejected' ? prev.autoRejectCount + 1 : prev.autoRejectCount,
    }));

    setTimeout(() => {
      setJobQueue((prev) => prev.slice(1));
      setIsProcessing(false);
    }, 1500);

  }, [jobQueue, isRunning, isProcessing]);

  // 5. Polling
  useEffect(() => {
    fetchApplications();
    const interval = setInterval(fetchApplications, 5000);
    return () => clearInterval(interval);
  }, [fetchApplications]);

  // 6. RESTORED: Reset Function
  const resetSimulation = useCallback(() => {
    setJobs([]);
    setLogs([]);
    setStats({ jobsScanned: 0, applicationsSent: 0, autoRejectCount: 0, successRate: 0 });
    setJobQueue([]);
    setProcessedIds(new Set()); 
    setIsRunning(true);
  }, []);

  return { 
    jobs, 
    logs, 
    stats, 
    isRunning, 
    toggleSimulation: () => setIsRunning(!isRunning),
    resetSimulation // ✅ Exported properly
  };
};