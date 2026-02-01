import { useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Terminal as TerminalIcon } from 'lucide-react';
import { LogEntry } from '@/types/job';

interface TerminalProps {
  logs: LogEntry[];
}

const formatTime = (date: Date): string => {
  return date.toLocaleTimeString('en-US', { 
    hour12: false, 
    hour: '2-digit', 
    minute: '2-digit', 
    second: '2-digit' 
  });
};

const typeColors: Record<LogEntry['type'], string> = {
  info: 'text-muted-foreground',
  success: 'text-success text-glow-success',
  error: 'text-destructive',
  processing: 'text-processing text-glow-processing',
  applied: 'text-applied',
};

export const Terminal = ({ logs }: TerminalProps) => {
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [logs]);

  return (
    <div className="relative h-64 rounded-lg border border-terminal-border bg-terminal-bg overflow-hidden scanlines">
      {/* Terminal Header */}
      <div className="flex items-center gap-2 px-4 py-2 border-b border-terminal-border bg-secondary/30">
        <div className="flex gap-1.5">
          <div className="w-3 h-3 rounded-full bg-destructive/80" />
          <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
          <div className="w-3 h-3 rounded-full bg-success/80" />
        </div>
        <div className="flex-1 flex items-center justify-center gap-2">
          <TerminalIcon className="w-4 h-4 text-muted-foreground" />
          <span className="text-xs font-mono text-muted-foreground">agent.log — autonomous-job-agent</span>
        </div>
      </div>

      {/* Terminal Content */}
      <div 
        ref={scrollRef}
        className="h-[calc(100%-40px)] overflow-y-auto p-4 font-mono text-sm"
      >
        <AnimatePresence mode="popLayout">
          {logs.length === 0 && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-muted-foreground"
            >
              <span className="text-terminal-text">$</span> Initializing agent...
              <span className="inline-block w-2 h-4 ml-1 bg-terminal-text animate-blink" />
            </motion.div>
          )}
          
          {logs.map((log) => (
            <motion.div
              key={log.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="flex gap-2 mb-1 leading-relaxed"
            >
              <span className="text-muted-foreground shrink-0">[{formatTime(log.timestamp)}]</span>
              <span className={typeColors[log.type]}>{log.message}</span>
            </motion.div>
          ))}
        </AnimatePresence>
        
        {logs.length > 0 && (
          <div className="flex items-center mt-2">
            <span className="text-terminal-text">$</span>
            <span className="inline-block w-2 h-4 ml-1 bg-terminal-text animate-blink" />
          </div>
        )}
      </div>
    </div>
  );
};
