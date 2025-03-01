import { z } from 'zod';

export const RegisterSchema = z.object({
  username: z.string()
    .min(6, '用户名至少6个字符')
    .max(20, '用户名最多20个字符'),
  password: z.string()
    .min(6, '密码至少6个字符')
    .max(20, '密码最多20个字符')
});

export const LoginSchema = z.object({
  username: z.string(),
  password: z.string()
});

export const UpdateProfileSchema = z.object({
  username: z.string().optional(),
  avatar: z.string().optional(),
  bio: z.string().optional()
});

export type RegisterInput = z.infer<typeof RegisterSchema>;
export type LoginInput = z.infer<typeof LoginSchema>;
export type UpdateProfileInput = z.infer<typeof UpdateProfileSchema>; 