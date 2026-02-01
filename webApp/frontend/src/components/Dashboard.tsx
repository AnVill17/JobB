import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Job } from '@/types/job';
import { JobCard } from './JobCard';
import { ArtifactModal } from './ArtifactModal';

interface DashboardProps {
  jobs: Job[];
}

export const Dashboard = ({ jobs }: DashboardProps) => {
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);

  const handleViewEvidence = (job: Job) => {
    setSelectedJob(job);
  };

  const handleCloseModal = () => {
    setSelectedJob(null);
  };

  // Sort jobs: processing first, then applied, then queued, then rejected
  const sortedJobs = [...jobs].sort((a, b) => {
    const order = {
      analyzing: 0,
      generating_artifacts: 1,
      applied: 2,
      queued: 3,
      rejected: 4,
    };
    return order[a.status] - order[b.status];
  });

  return (
    <>
      <motion.div 
        layout
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4"
      >
        <AnimatePresence mode="popLayout">
          {sortedJobs.map((job) => (
            <JobCard 
              key={job.id} 
              job={job} 
              onViewEvidence={handleViewEvidence}
            />
          ))}
        </AnimatePresence>
      </motion.div>

      <AnimatePresence>
        {selectedJob && (
          <ArtifactModal job={selectedJob} onClose={handleCloseModal} />
        )}
      </AnimatePresence>
    </>
  );
};
