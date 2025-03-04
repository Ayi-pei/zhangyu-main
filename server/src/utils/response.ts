export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
  timestamp: string;
}

export const successResponse = <T>(data: T, message = '操作成功'): ApiResponse<T> => ({
  success: true,
  data,
  message,
  timestamp: new Date().toISOString()
});

export const errorResponse = (message: string, error?: any): ApiResponse => ({
  success: false,
  message,
  error: error?.message || error,
  timestamp: new Date().toISOString()
}); 