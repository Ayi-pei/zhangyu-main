import { z } from 'zod';

export const UpdateProfileSchema = z.object({
  username: z.string().optional(),
  avatar: z.string().optional(),
  bio: z.string().optional()
});

export type UpdateProfileDto = z.infer<typeof UpdateProfileSchema>;

export interface UserSchema {
  username: string;
  email: string;
  password: string;
} 