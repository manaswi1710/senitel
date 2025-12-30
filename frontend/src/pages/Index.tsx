import { useState } from 'react';
import { motion } from 'framer-motion';
import { useScanner, type ReadmeScanResponse, type ScanResult } from '@/hooks/useScanner';
import { Header } from '@/components/scanner/Header';
import { SearchBar } from '@/components/scanner/SearchBar';
import { ScanResults } from '@/components/scanner/ScanResults';
import { toast } from 'sonner';

const Index = () => {
  const { scanReadme, scanPackage, loading, error } = useScanner();
  const [readmeResult, setReadmeResult] = useState<ReadmeScanResponse | null>(null);
  const [packageResult, setPackageResult] = useState<ScanResult | null>(null);

  const handleScanReadme = async (url: string) => {
    setPackageResult(null);
    const result = await scanReadme(url);
    if (result) {
      setReadmeResult(result);
      const threats = result.stats.hallucinations + result.stats.suspicious;
      if (threats > 0) {
        toast.error(`Found ${threats} potential threat${threats > 1 ? 's' : ''}!`);
      } else {
        toast.success('All packages verified safe!');
      }
    }
  };

  const handleScanPackage = async (name: string, ecosystem: string) => {
    setReadmeResult(null);
    const result = await scanPackage(name, ecosystem);
    if (result) {
      setPackageResult(result);
      if (result.risk.level === 'SAFE') {
        toast.success('Package verified safe!');
      } else {
        toast.error(`${result.risk.status}`);
      }
    }
  };

  return (
    <div className="relative min-h-screen bg-background bg-grid">
        {/* Background glow effects */}
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="absolute -left-40 top-0 h-[500px] w-[500px] rounded-full bg-primary/5 blur-3xl" />
          <div className="absolute -right-40 bottom-0 h-[500px] w-[500px] rounded-full bg-accent/5 blur-3xl" />
        </div>

        <main className="container relative z-10 mx-auto max-w-4xl px-4 py-12 md:py-20">
          <div className="space-y-12">
            <Header />
            
            <SearchBar
              onScanReadme={handleScanReadme}
              onScanPackage={handleScanPackage}
              loading={loading}
            />

            {error && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="rounded-xl border border-destructive/30 bg-destructive/10 p-4 text-center"
              >
                <p className="text-destructive">{error}</p>
                <p className="mt-1 text-sm text-muted-foreground">
                  Make sure your backend server is running on localhost:8000
                </p>
              </motion.div>
            )}

            <ScanResults 
              readmeResult={readmeResult} 
              packageResult={packageResult} 
            />

            {/* Empty State */}
            {!readmeResult && !packageResult && !error && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="rounded-xl border border-border/50 bg-card/50 p-8 text-center backdrop-blur-sm"
              >
                <p className="font-mono text-sm text-muted-foreground">
                  <span className="text-primary">$</span> awaiting scan target
                  <span className="animate-terminal-blink">_</span>
                </p>
                <p className="mt-4 text-sm text-muted-foreground">
                  Enter a GitHub repository URL to scan its README for potentially dangerous packages,
                  or check a single package name directly.
                </p>
              </motion.div>
            )}
          </div>
        </main>

        {/* Footer */}
        <footer className="relative z-10 border-t border-border/50 py-6">
          <div className="container mx-auto px-4 text-center">
            <p className="font-mono text-sm text-muted-foreground">
              SENTINEL SECURITY SCANNER v1.0
            </p>
          </div>
        </footer>
      </div>
  );
};

export default Index;
