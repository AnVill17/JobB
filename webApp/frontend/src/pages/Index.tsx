import { useAgentBackend } from '@/hooks/useAgentBackend';
import { Header } from '@/components/Header';
import { Stats } from '@/components/Stats';
import { Dashboard } from '@/components/Dashboard';
import { Terminal } from '@/components/Terminal';

const Index = () => {
  const { jobs, logs, stats, isRunning, toggleSimulation, resetSimulation } = useAgentBackend();

  return (
    <div className="min-h-screen bg-background">
      {/* Subtle grid background */}
      <div 
        className="fixed inset-0 pointer-events-none opacity-[0.02]"
        style={{
          backgroundImage: `
            linear-gradient(to right, hsl(var(--foreground)) 1px, transparent 1px),
            linear-gradient(to bottom, hsl(var(--foreground)) 1px, transparent 1px)
          `,
          backgroundSize: '40px 40px',
        }}
      />

      <Header 
        isRunning={isRunning} 
        onToggle={toggleSimulation} 
        onReset={resetSimulation} 
      />

      <main className="container mx-auto px-4 py-6 space-y-6">
        {/* Stats Bar */}
        <Stats stats={stats} />

        {/* Job Cards Grid */}
        <section>
          <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-processing animate-pulse" />
            Live Application Feed
          </h2>
          <Dashboard jobs={jobs} />
        </section>

        {/* Terminal */}
        <section>
          <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-terminal-text" />
            Agent Logs
          </h2>
          <Terminal logs={logs} />
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-border py-4 mt-8">
        <div className="container mx-auto px-4 text-center text-xs text-muted-foreground font-mono">
          autonomous-job-agent © 2026 • all systems operational
        </div>
      </footer>
    </div>
  );
};

export default Index;
