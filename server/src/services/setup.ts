// 测试环境设置
process.env.NODE_ENV = "test";

// 设置测试数据库连接
process.env.DATABASE_URL = "postgresql://postgres:postgres@localhost:5432/test";

// 设置测试 Redis 连接
process.env.REDIS_URL = "redis://localhost:6379";

// 设置测试 JWT 密钥
process.env.JWT_SECRET = "test-secret-key";

// 其他全局测试设置
jest.setTimeout(10000); // 设置测试超时时间为 10 秒
