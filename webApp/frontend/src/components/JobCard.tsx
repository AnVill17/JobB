import { motion } from 'framer-motion';
import { MapPin, DollarSign, Clock, Eye, CheckCircle, XCircle, Loader2, FileText } from 'lucide-react';
import { Job, JobStatus } from '@/types/job';
import { Button } from '@/components/ui/button';

interface JobCardProps {
  job: Job;
  onViewEvidence: (job: Job) => void;
}

const statusConfig: Record<JobStatus, {
  label: string;
  icon: React.ElementType;
  className: string;
  cardClassName: string;
}> = {
  queued: {
    label: 'Queued',
    icon: Clock,
    className: 'text-muted-foreground bg-muted/50',
    cardClassName: 'border-border',
  },
  analyzing: {
    label: 'Analyzing',
    icon: Loader2,
    className: 'text-processing bg-processing/20',
    cardClassName: 'border-processing animate-pulse-border',
  },
  generating_artifacts: {
    label: 'Generating',
    icon: FileText,
    className: 'text-processing bg-processing/20',
    cardClassName: 'border-processing animate-pulse-border glow-processing',
  },
  applied: {
    label: 'Applied',
    icon: CheckCircle,
    className: 'text-applied bg-applied/20',
    cardClassName: 'border-applied/50 glow-applied',
  },
  rejected: {
    label: 'Rejected',
    icon: XCircle,
    className: 'text-destructive bg-destructive/20',
    cardClassName: 'border-destructive/50',
  },
  accepted: {
    label: 'Accepted',
    icon: CheckCircle,
    className: 'text-success bg-success/20',
    cardClassName: 'border-success/50 glow-success',
  },
};

export const JobCard = ({ job, onViewEvidence }: JobCardProps) => {
  const config = statusConfig[job.status];
  const StatusIcon = config.icon;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.3 }}
      className={`relative p-4 rounded-lg border bg-card transition-all duration-500 ${config.cardClassName}`}
    >
      {/* Status Badge */}
      <motion.div 
        layout
        className={`absolute -top-2 -right-2 flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${config.className}`}
      >
        <StatusIcon className={`w-3.5 h-3.5 ${job.status === 'analyzing' || job.status === 'generating_artifacts' ? 'animate-spin' : ''}`} />
        {config.label}
      </motion.div>

      {/* Company Header */}
      <div className="flex items-start gap-3 mb-3">
        <div className="w-12 h-12 rounded-lg bg-secondary flex items-center justify-center text-2xl">
          {job.logo}
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-foreground truncate">{job.title}</h3>
          <p className="text-sm text-muted-foreground">{job.company}</p>
        </div>
      </div>

      {/* Job Details */}
      <div className="space-y-2 mb-4">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <MapPin className="w-4 h-4" />
          <span>{job.location}</span>
        </div>
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <DollarSign className="w-4 h-4" />
          <span className="font-mono">{job.salary}</span>
        </div>
      </div>

      {/* Action Button */}
      {(job.status === 'applied' || job.status === 'accepted') && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Button 
            variant="outline" 
            size="sm" 
            className={`w-full ${
              job.status === 'accepted' 
                ? 'border-success/50 text-success hover:bg-success/10 hover:text-success'
                : 'border-applied/50 text-applied hover:bg-applied/10 hover:text-applied'
            }`}
            onClick={() => onViewEvidence(job)}
          >
            <Eye className="w-4 h-4 mr-2" />
            View Evidence
          </Button>
        </motion.div>
      )}

      {job.status === 'rejected' && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-xs text-muted-foreground text-center py-1"
        >
          Qualifications did not match requirements
        </motion.div>
      )}

      {(job.status === 'queued') && (
        <div className="h-8 flex items-center justify-center">
          <div className="flex gap-1">
            {[0, 1, 2].map((i) => (
              <motion.div
                key={i}
                className="w-1.5 h-1.5 rounded-full bg-muted-foreground"
                animate={{ opacity: [0.3, 1, 0.3] }}
                transition={{ duration: 1.5, repeat: Infinity, delay: i * 0.2 }}
              />
            ))}
          </div>
        </div>
      )}
    </motion.div>
  );
};
