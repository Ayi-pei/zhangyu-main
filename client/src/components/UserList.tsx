import React,{ useEffect, useState } from 'react';
import { supabase } from './supabaseClient';

function UserList() {
  const [users, setUsers] = useState<any[]>([]);

  useEffect(() => {
    const fetchUsers = async () => {
      const { data, error } = await supabase
        .from('users')  // 订阅的是 users 表
        .select('*');

      if (error) {
        console.error('Error fetching users:', error);
      } else {
        setUsers(data);
      }
    };

    // 初次加载用户数据
    fetchUsers();

    // 设置实时订阅
    const subscription = supabase
      .from('users')  // 监听 users 表的变化
      .on('*', payload => {
        console.log('Change received!', payload);
        fetchUsers();  // 当数据发生变化时重新拉取数据
      })
      .subscribe();

    return () => {
      supabase.removeSubscription(subscription);  // 清理订阅
    };
  }, []);

  return (
    <div>
      <h1>User List</h1>
      {users.length > 0 ? (
        <ul>
          {users.map((user, index) => (
            <li key={index}>{user.username}</li>  // 假设 user 有 username 字段
          ))}
        </ul>
      ) : (
        <p>No users found.</p>
      )}
    </div>
  );
}

export default UserList;
