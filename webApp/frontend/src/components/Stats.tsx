import { motion } from 'framer-motion';
import { Zap, Send, XCircle, TrendingUp } from 'lucide-react';
import { AgentStats } from '@/types/job';

interface StatsProps {
  stats: AgentStats;
}

const StatCard = ({ 
  icon: Icon, 
  label, 
  value, 
  color,
  delay 
}: { 
  icon: React.ElementType;
  label: string; 
  value: number | string;
  color: 'success' | 'processing' | 'destructive' | 'muted';
  delay: number;
}) => {
  const colorClasses = {
    success: 'text-success border-success/30 bg-success/5',
    processing: 'text-processing border-processing/30 bg-processing/5',
    destructive: 'text-destructive border-destructive/30 bg-destructive/5',
    muted: 'text-muted-foreground border-muted bg-muted/20',
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
      className={`flex items-center gap-3 px-4 py-3 rounded-lg border ${colorClasses[color]}`}
    >
      <Icon className="w-5 h-5" />
      <div className="flex flex-col">
        <span className="text-xs font-medium uppercase tracking-wider opacity-70">{label}</span>
        <motion.span 
          key={value}
          initial={{ scale: 1.2 }}
          animate={{ scale: 1 }}
          className="text-xl font-bold font-mono"
        >
          {value}
        </motion.span>
      </div>
    </motion.div>
  );
};

export const Stats = ({ stats }: StatsProps) => {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      <StatCard 
        icon={Zap}
        label="Jobs Scanned" 
        value={stats.jobsScanned} 
        color="processing"
        delay={0}
      />
      <StatCard 
        icon={Send}
        label="Applications Sent" 
        value={stats.applicationsSent} 
        color="success"
        delay={0.1}
      />
      <StatCard 
        icon={XCircle}
        label="Auto-Rejected" 
        value={stats.autoRejectCount} 
        color="destructive"
        delay={0.2}
      />
      <StatCard 
        icon={TrendingUp}
        label="Success Rate" 
        value={`${stats.successRate}%`} 
        color="muted"
        delay={0.3}
      />
    </div>
  );
};
