import { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, Github, Package, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface SearchBarProps {
  onScanReadme: (url: string) => void;
  onScanPackage: (name: string, ecosystem: string) => void;
  loading: boolean;
}

type ScanMode = 'readme' | 'package';

export function SearchBar({ onScanReadme, onScanPackage, loading }: SearchBarProps) {
  const [mode, setMode] = useState<ScanMode>('readme');
  const [input, setInput] = useState('');
  const [ecosystem, setEcosystem] = useState<'npm' | 'pypi'>('npm');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;
    
    if (mode === 'readme') {
      onScanReadme(input.trim());
    } else {
      onScanPackage(input.trim(), ecosystem);
    }
  };

  const placeholder = mode === 'readme' 
    ? 'https://github.com/user/repo' 
    : 'Package name (e.g., react, requests)';

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-4"
    >
      {/* Mode Toggle */}
      <div className="flex items-center justify-center gap-2">
        <button
          onClick={() => setMode('readme')}
          className={cn(
            'flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-all',
            mode === 'readme'
              ? 'bg-primary text-primary-foreground'
              : 'bg-secondary text-muted-foreground hover:text-foreground'
          )}
        >
          <Github className="h-4 w-4" />
          Scan README
        </button>
        <button
          onClick={() => setMode('package')}
          className={cn(
            'flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-all',
            mode === 'package'
              ? 'bg-primary text-primary-foreground'
              : 'bg-secondary text-muted-foreground hover:text-foreground'
          )}
        >
          <Package className="h-4 w-4" />
          Single Package
        </button>
      </div>

      {/* Search Form */}
      <form onSubmit={handleSubmit} className="relative">
        <div className="gradient-border overflow-hidden rounded-xl">
          <div className="flex items-center bg-card">
            <div className="flex items-center gap-2 border-r border-border px-4">
              <Search className="h-5 w-5 text-muted-foreground" />
            </div>
            
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={placeholder}
              className="flex-1 bg-transparent px-4 py-4 font-mono text-sm text-foreground placeholder:text-muted-foreground focus:outline-none"
            />

            {mode === 'package' && (
              <div className="flex items-center border-l border-border">
                <button
                  type="button"
                  onClick={() => setEcosystem('npm')}
                  className={cn(
                    'px-3 py-4 text-sm font-mono transition-colors',
                    ecosystem === 'npm' 
                      ? 'bg-accent/20 text-accent' 
                      : 'text-muted-foreground hover:text-foreground'
                  )}
                >
                  npm
                </button>
                <button
                  type="button"
                  onClick={() => setEcosystem('pypi')}
                  className={cn(
                    'px-3 py-4 text-sm font-mono transition-colors',
                    ecosystem === 'pypi' 
                      ? 'bg-accent/20 text-accent' 
                      : 'text-muted-foreground hover:text-foreground'
                  )}
                >
                  pypi
                </button>
              </div>
            )}

            <Button
              type="submit"
              variant="scan"
              size="lg"
              disabled={loading || !input.trim()}
              className="m-2 rounded-lg"
            >
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Scanning...
                </>
              ) : (
                <>
                  <Search className="h-4 w-4" />
                  Scan
                </>
              )}
            </Button>
          </div>
        </div>
      </form>
    </motion.div>
  );
}
