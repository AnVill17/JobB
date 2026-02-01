import { motion, AnimatePresence } from 'framer-motion';
import { X, FileText, FileCode, CheckCircle2, Copy } from 'lucide-react';
import { Job } from '@/types/job';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { toast } from '@/hooks/use-toast';

interface ArtifactModalProps {
  job: Job | null;
  onClose: () => void;
}

const CodeBlock = ({ content, title }: { content: string; title: string }) => {
  const lines = content.split('\n');
  
  const handleCopy = () => {
    navigator.clipboard.writeText(content);
    toast({
      title: "Copied to clipboard",
      description: "The content has been copied successfully.",
    });
  };

  return (
    <div className="rounded-lg border border-border bg-secondary/30 overflow-hidden">
      <div className="flex items-center justify-between px-4 py-2 border-b border-border bg-secondary/50">
        <div className="flex items-center gap-2">
          <FileCode className="w-4 h-4 text-processing" />
          <span className="text-sm font-medium text-muted-foreground">{title}</span>
        </div>
        <Button variant="ghost" size="sm" onClick={handleCopy} className="h-7 px-2">
          <Copy className="w-3.5 h-3.5" />
        </Button>
      </div>
      <ScrollArea className="h-64">
        <div className="p-4 font-mono text-sm">
          {lines.map((line, index) => (
            <div key={index} className="flex gap-4">
              <span className="w-8 text-right text-muted-foreground/50 select-none shrink-0">
                {index + 1}
              </span>
              <span className="text-foreground/90 whitespace-pre-wrap">{line || ' '}</span>
            </div>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
};

export const ArtifactModal = ({ job, onClose }: ArtifactModalProps) => {
  if (!job) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm"
        onClick={onClose}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          className="relative w-full max-w-6xl max-h-[90vh] bg-card border border-border rounded-xl shadow-2xl overflow-hidden"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-border bg-secondary/30">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-lg bg-success/20 flex items-center justify-center">
                <CheckCircle2 className="w-6 h-6 text-success" />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-foreground">Application Evidence</h2>
                <p className="text-sm text-muted-foreground">
                  {job.title} at {job.company}
                </p>
              </div>
            </div>
            <Button variant="ghost" size="icon" onClick={onClose}>
              <X className="w-5 h-5" />
            </Button>
          </div>

          {/* Content */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 p-6 max-h-[calc(90vh-80px)] overflow-y-auto">
            {/* Left Side - Job Description */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                <FileText className="w-4 h-4" />
                Job Description
              </div>
              <div className="rounded-lg border border-border bg-secondary/20 p-4">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-lg bg-secondary flex items-center justify-center text-xl">
                    {job.logo}
                  </div>
                  <div>
                    <h3 className="font-semibold">{job.title}</h3>
                    <p className="text-sm text-muted-foreground">{job.company} • {job.location}</p>
                  </div>
                </div>
                
                <div className="space-y-4 text-sm text-foreground/80">
                  <p>{job.description}</p>
                  
                  <div>
                    <h4 className="font-medium text-foreground mb-2">Requirements:</h4>
                    <ul className="space-y-1">
                      {(job.requirements ?? []).map((req, index) => (
                        <li key={index} className="flex items-start gap-2">
                          <span className="text-processing mt-1">•</span>
                          <span>{req}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="pt-2 border-t border-border">
                    <span className="font-medium text-success">Salary: </span>
                    <span className="font-mono">{job.salary}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Side - Generated Artifacts */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                <FileCode className="w-4 h-4" />
                Generated Artifacts
              </div>
              
              <CodeBlock 
                title="cover_letter.txt" 
                content={job.coverLetter || 'No cover letter generated'} 
              />

              <div className="rounded-lg border border-border bg-secondary/30 overflow-hidden">
                <div className="flex items-center gap-2 px-4 py-2 border-b border-border bg-secondary/50">
                  <FileCode className="w-4 h-4 text-success" />
                  <span className="text-sm font-medium text-muted-foreground">resume_analysis.json</span>
                </div>
                <div className="p-4 font-mono text-sm space-y-1">
                  {job.resumeHighlights?.map((highlight, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="text-success/90"
                    >
                      {highlight}
                    </motion.div>
                  ))}
                </div>
              </div>

              <div className="flex items-center gap-2 p-3 rounded-lg bg-success/10 border border-success/30">
                <CheckCircle2 className="w-5 h-5 text-success" />
                <span className="text-sm text-success">
                  Application submitted at {job.appliedAt?.toLocaleTimeString()}
                </span>
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};
