import { motion } from 'framer-motion';
import { AlertTriangle, XOctagon, Shield, Package } from 'lucide-react';
import { cn } from '@/lib/utils';

interface StatsPanelProps {
  hallucinations: number;
  suspicious: number;
  total: number;
}

export function StatsPanel({ hallucinations, suspicious, total }: StatsPanelProps) {
  const safe = total - hallucinations - suspicious;
  
  const stats = [
    {
      label: 'Total Scanned',
      value: total,
      icon: Package,
      color: 'text-accent',
      bg: 'bg-accent/10',
    },
    {
      label: 'Hallucinations',
      value: hallucinations,
      icon: XOctagon,
      color: 'text-destructive',
      bg: 'bg-destructive/10',
      glow: hallucinations > 0 ? 'box-glow-red' : '',
    },
    {
      label: 'Suspicious',
      value: suspicious,
      icon: AlertTriangle,
      color: 'text-warning',
      bg: 'bg-warning/10',
      glow: suspicious > 0 ? 'box-glow-amber' : '',
    },
    {
      label: 'Verified Safe',
      value: safe,
      icon: Shield,
      color: 'text-safe',
      bg: 'bg-safe/10',
      glow: safe > 0 && hallucinations === 0 && suspicious === 0 ? 'box-glow-green' : '',
    },
  ];

  return (
    <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
      {stats.map((stat, index) => (
        <motion.div
          key={stat.label}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: index * 0.1 }}
          className={cn(
            'rounded-xl border border-border/50 p-4 backdrop-blur-sm',
            stat.bg,
            stat.glow
          )}
        >
          <div className="flex items-center justify-between">
            <stat.icon className={cn('h-5 w-5', stat.color)} />
            <span className={cn('font-mono text-3xl font-bold', stat.color)}>
              {stat.value}
            </span>
          </div>
          <p className="mt-2 text-sm text-muted-foreground">{stat.label}</p>
        </motion.div>
      ))}
    </div>
  );
}
