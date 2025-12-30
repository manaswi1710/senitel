import { motion } from 'framer-motion';
import { Shield, Zap } from 'lucide-react';

export function Header() {
  return (
    <motion.header
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="text-center"
    >
      <div className="mb-6 flex items-center justify-center gap-3">
        <div className="relative">
          <Shield className="h-12 w-12 text-primary" />
          <motion.div
            animate={{ scale: [1, 1.2, 1], opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="absolute inset-0 rounded-full bg-primary/20 blur-xl"
          />
        </div>
        <h1 className="font-mono text-4xl font-bold tracking-tight text-foreground md:text-5xl">
          <span className="text-glow-green text-primary">SENTINEL</span>
        </h1>
      </div>

      <p className="mx-auto max-w-2xl text-lg text-muted-foreground">
        Protect your projects from{' '}
        <span className="text-destructive">AI-hallucinated packages</span> and{' '}
        <span className="text-warning">typosquatting attacks</span>.
      </p>

      <div className="mt-4 flex items-center justify-center gap-6 text-sm text-muted-foreground">
        <div className="flex items-center gap-2">
          <Zap className="h-4 w-4 text-accent" />
          <span>Real-time scanning</span>
        </div>
        <div className="flex items-center gap-2">
          <Shield className="h-4 w-4 text-safe" />
          <span>NPM + PyPI support</span>
        </div>
      </div>
    </motion.header>
  );
}
