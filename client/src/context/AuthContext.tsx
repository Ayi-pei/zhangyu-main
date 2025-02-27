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
  isAuthenticated: boolean;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // 计算是否已认证
  const isAuthenticated = !!user;

  const login = async (username: string, password: string) => {
    setIsLoading(true); // 开始加载
    try {
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
    } catch (error) {
      console.error("Login error:", error);
    } finally {
      setIsLoading(false); // 操作完成，停止加载
    }
  };

  const register = async (username: string, password: string) => {
    setIsLoading(true); // 开始加载
    try {
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
        // 注册成功后不自动登录
        console.log("User registered successfully");
      }
    } catch (error) {
      console.error("Register error:", error);
    } finally {
      setIsLoading(false); // 操作完成，停止加载
    }
  };

  const logout = async () => {
    setIsLoading(true); // 开始加载
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      setUser(null);
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      setIsLoading(false); // 操作完成，停止加载
    }
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, isAuthenticated, isLoading }}>
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
