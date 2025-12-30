import { motion } from 'framer-motion';
import { Shield, AlertTriangle, XOctagon, Package } from 'lucide-react';
import type { ScanResult } from '@/hooks/useScanner';
import { cn } from '@/lib/utils';

interface RiskCardProps {
  result: ScanResult;
  index: number;
}

const riskConfig = {
  CRITICAL: {
    icon: XOctagon,
    bgClass: 'bg-destructive/10 border-destructive/30',
    textClass: 'text-destructive',
    glowClass: 'box-glow-red',
    label: 'CRITICAL',
  },
  HIGH: {
    icon: AlertTriangle,
    bgClass: 'bg-warning/10 border-warning/30',
    textClass: 'text-warning',
    glowClass: 'box-glow-amber',
    label: 'HIGH RISK',
  },
  SAFE: {
    icon: Shield,
    bgClass: 'bg-safe/10 border-safe/30',
    textClass: 'text-safe',
    glowClass: 'box-glow-green',
    label: 'VERIFIED',
  },
};

export function RiskCard({ result, index }: RiskCardProps) {
  const config = riskConfig[result.risk.level];
  const Icon = config.icon;

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.1, duration: 0.4 }}
      className={cn(
        'relative rounded-lg border p-4 backdrop-blur-sm',
        config.bgClass,
        result.risk.level !== 'SAFE' && config.glowClass
      )}
    >
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-start gap-3">
          <div className={cn('rounded-lg p-2', config.bgClass)}>
            <Icon className={cn('h-5 w-5', config.textClass)} />
          </div>
          
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <Package className="h-4 w-4 text-muted-foreground" />
              <code className="font-mono text-sm text-foreground">
                {result.package}
              </code>
              <span className="rounded-full bg-secondary px-2 py-0.5 text-xs text-muted-foreground">
                {result.ecosystem}
              </span>
            </div>
            
            <p className={cn('text-sm font-medium', config.textClass)}>
              {result.risk.status}
            </p>
            
            {result.risk.reasons.map((reason, i) => (
              <p key={i} className="text-sm text-muted-foreground">
                {reason}
              </p>
            ))}
          </div>
        </div>

        <div className={cn(
          'rounded-full px-3 py-1 text-xs font-bold uppercase tracking-wider',
          config.bgClass,
          config.textClass
        )}>
          {config.label}
        </div>
      </div>

      {/* Scan line effect for dangerous packages */}
      {result.risk.level !== 'SAFE' && (
        <div className="pointer-events-none absolute inset-0 overflow-hidden rounded-lg">
          <div className="scan-line absolute inset-0" />
        </div>
      )}
    </motion.div>
  );
}
