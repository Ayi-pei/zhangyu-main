import { Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import { ServiceError } from '../types';

export function validateRequest(schema: z.ZodSchema) {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      await schema.parseAsync(req.body);
      next();
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({
          error: 'Validation failed',
          details: error.errors
        });
      } else {
        next(new ServiceError('Validation failed', 400, error));
      }
    }
  };
} 