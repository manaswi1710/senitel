import { motion } from 'framer-motion';
import { AlertCircle, CheckCircle2 } from 'lucide-react';
import { RiskCard } from './RiskCard';
import { StatsPanel } from './StatsPanel';
import type { ReadmeScanResponse, ScanResult } from '@/hooks/useScanner';

interface ScanResultsProps {
  readmeResult?: ReadmeScanResponse | null;
  packageResult?: ScanResult | null;
}

export function ScanResults({ readmeResult, packageResult }: ScanResultsProps) {
  // Single package result
  if (packageResult) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="space-y-6"
      >
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <span className="font-mono">SCAN RESULT</span>
          <span className="h-px flex-1 bg-border" />
        </div>
        <RiskCard result={packageResult} index={0} />
      </motion.div>
    );
  }

  // README scan results
  if (readmeResult) {
    const hasThreats = readmeResult.stats.hallucinations > 0 || readmeResult.stats.suspicious > 0;

    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="space-y-6"
      >
        {/* Stats Panel */}
        <StatsPanel 
          hallucinations={readmeResult.stats.hallucinations}
          suspicious={readmeResult.stats.suspicious}
          total={readmeResult.stats.total_scanned}
        />

        {/* Summary */}
        <div className={`rounded-xl border p-4 ${
          hasThreats 
            ? 'border-destructive/30 bg-destructive/5' 
            : 'border-safe/30 bg-safe/5'
        }`}>
          <div className="flex items-center gap-3">
            {hasThreats ? (
              <AlertCircle className="h-6 w-6 text-destructive" />
            ) : (
              <CheckCircle2 className="h-6 w-6 text-safe" />
            )}
            <div>
              <p className={`font-medium ${hasThreats ? 'text-destructive' : 'text-safe'}`}>
                {hasThreats 
                  ? `⚠️ Threats Detected in Repository` 
                  : '✓ All Packages Verified Safe'}
              </p>
              <p className="text-sm text-muted-foreground">
                Scanned from: <code className="font-mono">{readmeResult.url}</code>
              </p>
            </div>
          </div>
        </div>

        {/* Package Results */}
        {readmeResult.scan_results.length > 0 && (
          <>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <span className="font-mono">PACKAGE ANALYSIS</span>
              <span className="h-px flex-1 bg-border" />
            </div>
            
            <div className="space-y-3">
              {readmeResult.scan_results.map((result, index) => (
                <RiskCard key={`${result.package}-${index}`} result={result} index={index} />
              ))}
            </div>
          </>
        )}
      </motion.div>
    );
  }

  return null;
}
