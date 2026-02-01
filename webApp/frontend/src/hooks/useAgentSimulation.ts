import { useState, useEffect, useCallback, useRef } from 'react';
import { Job, JobStatus, LogEntry, AgentStats } from '@/types/job';
import { generateMockJobs, generateCoverLetter, generateResumeHighlights } from '@/data/mockJobs';

const formatTime = (date: Date): string => {
  return date.toLocaleTimeString('en-US', { 
    hour12: false, 
    hour: '2-digit', 
    minute: '2-digit', 
    second: '2-digit' 
  });
};

const generateLogMessage = (job: Job, status: JobStatus): string => {
  const icons = {
    analyzing: '🔍',
    generating_artifacts: '⚡',
    applied: '✅',
    rejected: '❌',
    queued: '📋',
  };

  const messages = {
    analyzing: `Analyzing job requirements for ${job.company}...`,
    generating_artifacts: `Generating cover letter for ${job.company}...`,
    applied: `Successfully applied to ${job.title} at ${job.company}`,
    rejected: `Auto-rejected by ${job.company} (qualifications mismatch)`,
    queued: `Queued ${job.title} at ${job.company}`,
  };

  return `${icons[status]} ${messages[status]}`;
};

export const useAgentSimulation = () => {
  const [jobs, setJobs] = useState<Job[]>(() => generateMockJobs());
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [stats, setStats] = useState<AgentStats>({
    jobsScanned: 0,
    applicationsSent: 0,
    autoRejectCount: 0,
    successRate: 0,
  });
  const [isRunning, setIsRunning] = useState(true);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const addLog = useCallback((message: string, type: LogEntry['type']) => {
    const newLog: LogEntry = {
      id: `log-${Date.now()}-${Math.random()}`,
      timestamp: new Date(),
      message,
      type,
    };
    setLogs(prev => [...prev.slice(-50), newLog]);
  }, []);

  const processNextJob = useCallback(() => {
    setJobs(currentJobs => {
      const queuedJobs = currentJobs.filter(j => j.status === 'queued');
      const analyzingJobs = currentJobs.filter(j => j.status === 'analyzing');
      const generatingJobs = currentJobs.filter(j => j.status === 'generating_artifacts');

      if (queuedJobs.length === 0 && analyzingJobs.length === 0 && generatingJobs.length === 0) {
        return currentJobs;
      }

      const updatedJobs = [...currentJobs];

      // Progress generating_artifacts to final state
      generatingJobs.forEach(job => {
        const index = updatedJobs.findIndex(j => j.id === job.id);
        if (index !== -1) {
          const success = Math.random() > 0.2; // 80% success rate
          const newStatus: JobStatus = success ? 'applied' : 'rejected';
          
          updatedJobs[index] = {
            ...updatedJobs[index],
            status: newStatus,
            appliedAt: success ? new Date() : undefined,
            coverLetter: success ? generateCoverLetter(job) : undefined,
            resumeHighlights: success ? generateResumeHighlights(job) : undefined,
          };

          setTimeout(() => {
            addLog(generateLogMessage(job, newStatus), success ? 'success' : 'error');
            setStats(prev => ({
              ...prev,
              applicationsSent: success ? prev.applicationsSent + 1 : prev.applicationsSent,
              autoRejectCount: success ? prev.autoRejectCount : prev.autoRejectCount + 1,
              successRate: prev.applicationsSent > 0 
                ? Math.round(((success ? prev.applicationsSent + 1 : prev.applicationsSent) / (prev.jobsScanned)) * 100)
                : 0,
            }));
          }, 0);
        }
      });

      // Progress analyzing to generating_artifacts
      analyzingJobs.forEach(job => {
        const index = updatedJobs.findIndex(j => j.id === job.id);
        if (index !== -1) {
          updatedJobs[index] = { ...updatedJobs[index], status: 'generating_artifacts' };
          setTimeout(() => addLog(generateLogMessage(job, 'generating_artifacts'), 'processing'), 0);
        }
      });

      // Start analyzing a queued job
      if (queuedJobs.length > 0 && analyzingJobs.length < 2) {
        const nextJob = queuedJobs[0];
        const index = updatedJobs.findIndex(j => j.id === nextJob.id);
        if (index !== -1) {
          updatedJobs[index] = { ...updatedJobs[index], status: 'analyzing' };
          setTimeout(() => {
            addLog(generateLogMessage(nextJob, 'analyzing'), 'info');
            setStats(prev => ({ ...prev, jobsScanned: prev.jobsScanned + 1 }));
          }, 0);
        }
      }

      return updatedJobs;
    });
  }, [addLog]);

  useEffect(() => {
    if (isRunning) {
      // Initial log
      addLog('🚀 Agent initialized. Starting job scan...', 'info');
      
      intervalRef.current = setInterval(processNextJob, 2000);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isRunning, processNextJob, addLog]);

  const toggleSimulation = useCallback(() => {
    setIsRunning(prev => !prev);
  }, []);

  const resetSimulation = useCallback(() => {
    setJobs(generateMockJobs());
    setLogs([]);
    setStats({
      jobsScanned: 0,
      applicationsSent: 0,
      autoRejectCount: 0,
      successRate: 0,
    });
    setIsRunning(true);
    addLog('🔄 Agent reset. Starting fresh scan...', 'info');
  }, [addLog]);

  return {
    jobs,
    logs,
    stats,
    isRunning,
    toggleSimulation,
    resetSimulation,
  };
};
