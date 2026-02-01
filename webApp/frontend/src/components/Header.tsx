import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Bot, Power, RotateCcw, Cpu, AlertOctagon, Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface HeaderProps {
  isRunning: boolean;
  onToggle: () => void;
  onReset: () => void;
  onKillSwitch?: () => void;
}

export const Header = ({ isRunning, onToggle, onReset, onKillSwitch }: HeaderProps) => {
  const navigate = useNavigate();

  const handleKillSwitch = () => {
    if (onKillSwitch) {
      onKillSwitch();
    }
    // Navigate back to setup
    navigate('/');
  };

  return (
    <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-40">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo & Title */}
          <div className="flex items-center gap-3">
            <motion.div
              animate={{ 
                rotate: isRunning ? [0, 360] : 0,
              }}
              transition={{ 
                duration: 3, 
                repeat: isRunning ? Infinity : 0,
                ease: 'linear'
              }}
              className="relative"
            >
              <div className="w-10 h-10 rounded-lg bg-processing/20 flex items-center justify-center">
                <Bot className="w-6 h-6 text-processing" />
              </div>
              {isRunning && (
                <motion.div
                  className="absolute inset-0 rounded-lg border-2 border-processing"
                  animate={{ scale: [1, 1.2, 1], opacity: [1, 0, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                />
              )}
            </motion.div>
            <div>
              <h1 className="text-xl font-bold gradient-text">Autonomous Job Agent</h1>
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <Cpu className="w-3 h-3" />
                <span className="font-mono">v2.4.1</span>
                <span className="mx-1">•</span>
                <span className={`flex items-center gap-1 ${isRunning ? 'text-success' : 'text-destructive'}`}>
                  <span className={`w-1.5 h-1.5 rounded-full ${isRunning ? 'bg-success animate-pulse' : 'bg-destructive'}`} />
                  {isRunning ? 'ACTIVE' : 'PAUSED'}
                </span>
              </div>
            </div>
          </div>

          {/* Controls */}
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate('/')}
              className="text-muted-foreground hover:text-foreground"
            >
              <Settings className="w-4 h-4 mr-2" />
              Settings
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={onReset}
              className="border-muted-foreground/30"
            >
              <RotateCcw className="w-4 h-4 mr-2" />
              Reset
            </Button>
            <Button
              variant={isRunning ? 'destructive' : 'default'}
              size="sm"
              onClick={onToggle}
              className={isRunning ? '' : 'bg-success hover:bg-success/90'}
            >
              <Power className="w-4 h-4 mr-2" />
              {isRunning ? 'Pause' : 'Resume'}
            </Button>
            <Button
              variant="destructive"
              size="sm"
              onClick={handleKillSwitch}
              className="bg-destructive/80 hover:bg-destructive"
            >
              <AlertOctagon className="w-4 h-4 mr-2" />
              Kill Switch
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
};
