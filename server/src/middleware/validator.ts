import { Request, Response, NextFunction } from 'express';

export const validateSchema = (schema: any) => {
  return (req: Request, res: Response, next: NextFunction) => {
    // 实现验证逻辑
  };
}; 