import { z } from 'zod';

export const CreateUserSchema = z.object({
  email: z.string().email('邮箱格式不正确'),
  password: z.string().min(6, '密码至少6个字符'),
  username: z.string().min(2, '用户名至少2个字符'),
});

export const LoginSchema = z.object({
  email: z.string().email('邮箱格式不正确'),
  password: z.string().min(6, '密码至少6个字符'),
});

export type CreateUserDto = z.infer<typeof CreateUserSchema>;
export type LoginDto = z.infer<typeof LoginSchema>; 