// FILEPATH: d:/ayi/zhangyu-main/client/src/context/AuthContext.tsx

import React, { createContext, useContext, useState, ReactNode } from "react";
import { supabase } from "../api/supabaseClient";

interface User {
  id: string;
  username: string;
}

interface AuthContextType {
  user: User | null;
  login: (username: string, password: string) => Promise<void>;
  register: (username: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);

  const login = async (username: string, password: string) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email: `${username}@example.com`, // 使用用户名作为邮箱的一部分
      password,
    });

    if (error) throw error;

    if (data.user) {
      setUser({
        id: data.user.id,
        username: username,
      });
    }
  };

  const register = async (username: string, password: string) => {
    const { data, error } = await supabase.auth.signUp({
      email: `${username}@example.com`, // 使用用户名作为邮箱的一部分
      password,
      options: {
        data: {
          username: username,
        },
      },
    });

    if (error) throw error;

    if (data.user) {
      // 注册后不自动登录，而是提示用户去登录
      console.log("User registered successfully");
    }
  };

  const logout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
