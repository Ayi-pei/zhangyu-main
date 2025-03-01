import { Counter, Histogram, Gauge } from 'prom-client';

export interface MetricsType {
  requestCount: Counter<string>;
  responseTime: Histogram<string>;
  statusCodes: Counter<string>;
  errorCount: Counter<string>;
  slowRequests: Counter<string>;
  memoryUsage: Gauge<string>;
}

export interface MetricLabels {
  method: string;
  path: string;
  status?: string;
  code?: string;
  type?: string;
}

export type AlertLevel = 'info' | 'warning' | 'error';

export interface AlertConfig {
  threshold: number;
  message: string;
  level: AlertLevel;
} 