import { Response } from 'express';
import { ServiceError } from '../types/error';

export class BaseController {
  protected async handleRequest<T>(
    res: Response,
    action: () => Promise<T>,
    successMessage = '操作成功',
    errorMessage = '操作失败'
  ) {
    try {
      const data = await action();
      return this.success(res, data, successMessage);
    } catch (error) {
      console.error(error);
      if (error instanceof ServiceError) {
        return this.error(res, error.message, error.statusCode);
      }
      return this.error(res, errorMessage);
    }
  }

  protected success<T>(
    res: Response,
    data: T,
    message = '操作成功',
    statusCode = 200
  ) {
    return res.status(statusCode).json({
      success: true,
      data,
      message,
      timestamp: new Date().toISOString()
    });
  }

  protected error(
    res: Response,
    message: string,
    statusCode = 400,
    errors?: any
  ) {
    return res.status(statusCode).json({
      success: false,
      message,
      errors,
      timestamp: new Date().toISOString()
    });
  }

  protected paginatedSuccess<T>(
    res: Response,
    {
      items,
      total,
      page,
      pageSize,
      totalPages
    }: {
      items: T[];
      total: number;
      page: number;
      pageSize: number;
      totalPages: number;
    },
    message = '获取列表成功'
  ) {
    return this.success(
      res,
      {
        records: items,
        pagination: {
          total,
          page,
          pageSize,
          totalPages
        }
      },
      message
    );
  }

  protected validationError(
    res: Response,
    errors: any[],
    message = '请求参数验证失败'
  ) {
    return this.error(res, message, 422, errors);
  }

  protected notFound(
    res: Response,
    message = '请求的资源不存在'
  ) {
    return this.error(res, message, 404);
  }

  protected unauthorized(
    res: Response,
    message = '未经授权的访问'
  ) {
    return this.error(res, message, 401);
  }

  protected forbidden(
    res: Response,
    message = '禁止访问该资源'
  ) {
    return this.error(res, message, 403);
  }
} 