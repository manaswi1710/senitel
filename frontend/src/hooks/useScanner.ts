import { useState } from 'react';

const API_BASE = 'http://localhost:8000';

export interface RiskInfo {
  level: 'CRITICAL' | 'HIGH' | 'SAFE';
  score: number;
  color: string;
  status: string;
  reasons: string[];
}

export interface ScanResult {
  package: string;
  ecosystem: string;
  risk: RiskInfo;
}

export interface ReadmeScanResponse {
  url: string;
  stats: {
    hallucinations: number;
    suspicious: number;
    total_scanned: number;
  };
  scan_results: ScanResult[];
}

export function useScanner() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const scanReadme = async (githubUrl: string): Promise<ReadmeScanResponse | null> => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch(`${API_BASE}/scan-readme`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ github_url: githubUrl }),
      });
      
      if (!response.ok) {
        const errData = await response.json().catch(() => ({}));
        throw new Error(errData.detail || 'Failed to scan README');
      }
      
      return await response.json();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      return null;
    } finally {
      setLoading(false);
    }
  };

  const scanPackage = async (name: string, ecosystem: string = 'npm'): Promise<ScanResult | null> => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch(`${API_BASE}/scan-package`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, ecosystem }),
      });
      
      if (!response.ok) {
        const errData = await response.json().catch(() => ({}));
        throw new Error(errData.detail || 'Failed to scan package');
      }
      
      return await response.json();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      return null;
    } finally {
      setLoading(false);
    }
  };

  return {
    scanReadme,
    scanPackage,
    loading,
    error,
  };
}
