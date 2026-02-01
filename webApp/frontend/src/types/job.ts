export type JobStatus = 'queued' | 'analyzing' | 'generating_artifacts' | 'applied' | 'rejected' | 'accepted';

export interface Job {
  id: string;
  company: string;
  title: string;
  location: string;
  salary: string;
  status: JobStatus;
  logo: string;
  description: string;
  requirements: string[];
  appliedAt?: Date;
  coverLetter?: string;
  resumeHighlights?: string[];
  skillsMatch?: string;
  matchScore?: string;
}

export interface LogEntry {
  id: string;
  timestamp: Date;
  message: string;
  type: 'info' | 'success' | 'error' | 'processing' | 'applied';
}

export interface AgentStats {
  jobsScanned: number;
  applicationsSent: number;
  autoRejectCount: number;
  successRate: number;
}

export interface UserProfile {
  resumeFile?: File;
  resumeText?: string;
  extraProjects: string;
  achievements: string;
}

export interface JobPreferences {
  maxApplicationsPerDay: number;
  minMatchThreshold: number;
  blockedCompanies: string[];
  blockedRoleTypes: string[];
  locationPreference: 'remote' | 'onsite' | 'hybrid' | 'any';
  visaSponsorship: boolean;
  startDatePreference: 'immediate' | 'flexible' | 'specific';
  specificStartDate?: string;
}
