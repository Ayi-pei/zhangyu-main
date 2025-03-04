-- 删除已存在的数据库（如果存在）
DROP DATABASE IF EXISTS lottery_db;
DROP DATABASE IF EXISTS lottery_db_shadow;

-- 创建主数据库
CREATE DATABASE lottery_db;

-- 创建影子数据库
CREATE DATABASE lottery_db_shadow;

-- 切换到主数据库
\c lottery_db;

-- 创建扩展（如果需要）
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 创建用户表
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    username VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    role VARCHAR(50) DEFAULT 'user',
    balance DECIMAL(10,2) DEFAULT 0,
    credits INTEGER DEFAULT 0,
    member_level VARCHAR(50) DEFAULT 'NORMAL',
    reputation INTEGER DEFAULT 100,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 创建更新时间触发器
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_users_updated_at
    BEFORE UPDATE ON users
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column(); 