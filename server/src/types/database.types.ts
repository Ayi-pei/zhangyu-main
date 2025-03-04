export interface DatabaseConfig {
  user: string;
  password: string;
  host: string;
  port: number;
  database: string;
}

export interface PoolConfig extends DatabaseConfig {
  max: number;
  idleTimeoutMillis: number;
  connectionTimeoutMillis: number;
} 