import type { PrismaTypes } from '../types/prisma';

export type IUser = PrismaTypes.UserWithRelations;

export interface IProfile {
  id: string;
  userId: string;
  avatar?: string;
  bio?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface IGameStats {
  id: string;
  userId: string;
  gamesPlayed: number;
  wins: number;
  losses: number;
} 