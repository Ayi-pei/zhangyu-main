// FILEPATH: d:/ayi/zhangyu-main/server/src/middleware/errorHandler.ts

import { Request, Response, NextFunction } from 'express';
import { logger } from '../utils/logger';
import { ServiceError } from '../types';

export function errorHandler(
  error: Error,
  _req: Request,
  res: Response,
  _next: NextFunction
): void {
  logger.error('Error:', error);

  if (error instanceof ServiceError) {
    res.status(error.statusCode).json({
      error: error.message,
      details: error.details
    });
    return;
  }

  res.status(500).json({
    error: 'Internal server error',
    message: error.message
  });
}

