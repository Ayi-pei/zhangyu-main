import { config as dotenvConfig } from 'dotenv';
import { DatabaseConfig } from '../types/database.types';

dotenvConfig();

export const config = {
  database: {
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    host: process.env.DB_HOST,
    port: parseInt(process.env.DB_PORT || '5432', 10),
    database: process.env.DB_DATABASE
  } as DatabaseConfig,
  
  server: {
    port: parseInt(process.env.PORT || '3000', 10)
  },
  
  supabase: {
    url: process.env.SUPABASE_URL,
    anonKey: process.env.SUPABASE_ANON_KEY
  }
};

export * from '../utils/error';
export * from '../models/dto/dto';
export * from '../enums/enums';
export * from '../utils/responses';
export * from '../utils/user';
export * from '../utils/metrics';
export * from '../utils/prisma';