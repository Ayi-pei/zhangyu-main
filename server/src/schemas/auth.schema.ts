import { z } from 'zod';

// 基础的用户名密码验证
const usernameSchema = z.string()
  .min(6, '用户名至少6个字符')
  .max(12, '用户名最多12个字符')
  .regex(/^[a-zA-Z0-9_]+$/, '用户名只能包含字母、数字和下划线');

const passwordSchema = z.string()
  .min(6, '密码至少6个字符')
  .max(12, '密码最多12个字符');

// 登录验证
export const LoginSchema = z.object({
  username: usernameSchema,
  password: passwordSchema
});

// 注册验证
export const RegisterSchema = LoginSchema.extend({
  confirmPassword: passwordSchema
}).refine((data) => data.password === data.confirmPassword, {
  message: "两次输入的密码不一致",
  path: ["confirmPassword"],
});

export const UpdateProfileSchema = z.object({
  username: z.string().optional(),
  avatar: z.string().optional(),
  bio: z.string().optional()
});

// 重置密码验证
export const ResetPasswordSchema = z.object({
  token: z.string(),
  password: passwordSchema,
  confirmPassword: passwordSchema
}).refine((data) => data.password === data.confirmPassword, {
  message: "两次输入的密码不一致",
  path: ["confirmPassword"],
});

// 忘记密码验证
export const ForgotPasswordSchema = z.object({
  username: usernameSchema
});

export type LoginInput = z.infer<typeof LoginSchema>;
export type RegisterInput = z.infer<typeof RegisterSchema>;
export type UpdateProfileInput = z.infer<typeof UpdateProfileSchema>;
export type ForgotPasswordInput = z.infer<typeof ForgotPasswordSchema>;
export type ResetPasswordInput = z.infer<typeof ResetPasswordSchema>; 