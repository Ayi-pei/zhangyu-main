// FILEPATH: d:/ayi/zhangyu-main/client/src/context/ThemeContext.tsx

import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';
import { ConfigProvider, theme } from 'antd';
import storage from '../utils/storage';

type ThemeMode = 'light' | 'dark';

interface ThemeContextType {
  themeMode: ThemeMode;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [themeMode, setThemeMode] = useState<ThemeMode>(() => {
    const savedTheme = storage.get('theme') as ThemeMode | null;
    return savedTheme || 'light';
  });

  useEffect(() => {
    storage.set('theme', themeMode);
    document.body.setAttribute('data-theme', themeMode);
  }, [themeMode]);

  const toggleTheme = () => {
    setThemeMode(prevTheme => (prevTheme === 'light' ? 'dark' : 'light'));
  };

  const { defaultAlgorithm, darkAlgorithm } = theme;

  return (
    <ThemeContext.Provider value={{ themeMode, toggleTheme }}>
      <ConfigProvider
        theme={{
          algorithm: themeMode === 'dark' ? darkAlgorithm : defaultAlgorithm,
          token: {
            // 自定义主题令牌
            colorPrimary: '#1890ff',
            borderRadius: 6,
          },
        }}
      >
        {children}
      </ConfigProvider>
    </ThemeContext.Provider>
  );
};

export const useTheme = (): ThemeContextType => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};
