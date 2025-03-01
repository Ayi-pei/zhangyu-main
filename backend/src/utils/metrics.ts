import client from 'prom-client';

// 创建一个注册表
const register = new client.Registry();

// 添加默认指标
client.collectDefaultMetrics({ register });

// 创建自定义指标
const httpRequestDurationMicroseconds = new client.Histogram({
  name: 'http_request_duration_ms',
  help: 'Duration of HTTP requests in ms',
  labelNames: ['method', 'route', 'code'],
  buckets: [0.1, 5, 15, 50, 100, 200, 300, 400, 500]
});

const httpRequestTotal = new client.Counter({
  name: 'http_request_total',
  help: 'Total number of HTTP requests',
  labelNames: ['method', 'route', 'code']
});

// 注册指标
register.registerMetric(httpRequestDurationMicroseconds);
register.registerMetric(httpRequestTotal);

export const metrics = {
  register,
  httpRequestDurationMicroseconds,
  httpRequestTotal
}; 