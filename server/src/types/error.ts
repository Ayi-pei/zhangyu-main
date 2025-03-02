export class ServiceError extends Error {
  constructor(
    message: string,
    public statusCode: number = 400,
    public isOperational: boolean = true
  ) {
    super(message);
    Object.setPrototypeOf(this, ServiceError.prototype);
  }
} 