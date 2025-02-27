// FILEPATH: d:/ayi/zhangyu-main/server/src/models/User.ts

import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true },
  password: { type: String, required: true },
  role: { type: String, required: true },
  gameStats: {
    gamesPlayed: { type: Number, default: 0 },
    wins: { type: Number, default: 0 },
    losses: { type: Number, default: 0 }
  },
  profile: {
    avatar: { type: String, default: '' },
    bio: { type: String, default: '' }
  },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
  creditScore: { type: Number, default: 0 },
  level: {
    level: { type: Number, enum: [1, 2, 3, 4], required: true },
    title: { type: String, required: true },
    color: { type: String, required: true }
  }
});

export default mongoose.model('User', userSchema);

interface UserLevel {
  level: 1 | 2 | 3 | 4; // 1: 灰星, 2: 金星1, 3: 金星2, 4: 金星3
  title: string;
  color: string;
}

export interface IUser {
  id: string;
  username: string;
  email: string;
  password: string;
  role: "user" | "admin";
  gameStats: {
    gamesPlayed: number;
    wins: number;
    losses: number;
  };
  profile: {
    avatar: string;
    bio: string;
  };
  createdAt: Date;
  updatedAt: Date;
  creditScore: number;
  level: UserLevel;
  credits: number;
}
