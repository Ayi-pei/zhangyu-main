export class ServiceError extends Error {
  constructor(
    message: string,
    public statusCode: number = 400
  ) {
    super(message);
    this.name = 'ServiceError';
  }
}

export class ValidationError extends ServiceError {
  constructor(message: string) {
    super(message, 422);
    this.name = 'ValidationError';
  }
}

export class AuthenticationError extends ServiceError {
  constructor(message: string = '认证失败') {
    super(message, 401);
    this.name = 'AuthenticationError';
  }
}

export class AuthorizationError extends ServiceError {
  constructor(message: string = '没有权限') {
    super(message, 403);
    this.name = 'AuthorizationError';
  }
}

export class NotFoundError extends ServiceError {
  constructor(message: string = '资源不存在') {
    super(message, 404);
    this.name = 'NotFoundError';
  }
} 