// src/api/admin.ts

// 这里使用 any 类型，但在实际应用中应该定义更具体的类型
export const fetchUserDetails = async (userId: string): Promise<any> => {
    // 实现获取用户详情的逻辑
    // 这里只是一个示例
    const response = await fetch(`/api/users/${userId}`);
    if (!response.ok) {
      throw new Error('Failed to fetch user details');
    }
    return response.json();
  };

  export const updateUserDetails = async (userId: string, userData: any): Promise<void> => {
    // 实现更新用户详情的逻辑
    // 这里只是一个示例
    const response = await fetch(`/api/users/${userId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userData),
    });
    if (!response.ok) {
      throw new Error('Failed to update user details');
    }
  };

  // src/api/admin.ts

// 获取所有用户的函数
export const fetchUsers = async () => {
  try {
    const response = await fetch('/api/users');
    if (!response.ok) {
      throw new Error('Failed to fetch users');
    }
    return await response.json(); // 返回用户数据
  } catch (err) {
    console.error(err);
    throw new Error('Unable to load users');
  }
};

// 更改用户状态（如封禁或解封）
export const toggleUserStatus = async (userId: string, isBanned: boolean): Promise<void> => {
  try {
    const response = await fetch(`/api/users/${userId}/ban`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ is_banned: !isBanned }),
    });
    if (!response.ok) {
      throw new Error('Failed to update user status');
    }
  } catch (err) {
    console.error('Error toggling user status:', err);
    throw new Error('Unable to toggle user status');
  }
};
