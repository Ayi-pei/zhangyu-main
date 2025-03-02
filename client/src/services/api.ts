import { ApiResponse } from '@/types';

export const userAPI = {
  login: async (credentials: { username: string; password: string }): Promise<ApiResponse> => {
    // Mock implementation
    return {
      success: true,
      data: {
        token: 'mock-token',
        user: {
          id: '1',
          username: credentials.username,
          role: 'user'
        }
      }
    };
  },
  
  getProfile: async (): Promise<ApiResponse> => {
    // Mock implementation
    return {
      success: true,
      data: {
        id: '1',
        username: 'test',
        role: 'user'
      }
    };
  }
}; 