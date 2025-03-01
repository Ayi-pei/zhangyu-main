// FILEPATH: d:/ayi/zhangyu-main/client/src/context/SettingsContext.tsx

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import storage from '../utils/storage';

interface Settings {
  language: string;
  notifications: boolean;
  soundEffects: boolean;
  autoSave: boolean;
  theme: 'light' | 'dark'; // 添加 theme 属性
  soundEnabled: boolean;   // 添加 soundEnabled 属性
}

interface SettingsContextType {
  settings: Settings;
  updateSettings: (newSettings: Partial<Settings>) => void;
}

const defaultSettings: Settings = {
  language: 'ko',
  notifications: true,
  soundEffects: true,
  autoSave: true,
  theme: 'light',         // 默认设置为 'light'
  soundEnabled: true,     // 默认设置为 true
};

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

export const SettingsProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [settings, setSettings] = useState<Settings>(() => {
    const savedSettings = storage.get('settings') as Settings | null;
    return savedSettings || defaultSettings;
  });

  useEffect(() => {
    storage.set('settings', settings);
  }, [settings]);

  const updateSettings = (newSettings: Partial<Settings>) => {
    setSettings(prevSettings => ({
      ...prevSettings,
      ...newSettings,
    }));
  };

  return (
    <SettingsContext.Provider value={{ settings, updateSettings }}>
      {children}
    </SettingsContext.Provider>
  );
};

export const useSettings = (): SettingsContextType => {
  const context = useContext(SettingsContext);
  if (context === undefined) {
    throw new Error('useSettings must be used within a SettingsProvider');
  }
  return context;
};

// 可选：导出一个高阶组件，用于包装需要访问设置的组件
export const withSettings = <P extends object>(
  Component: React.ComponentType<P & SettingsContextType>
): React.FC<P> => {
  return (props: P) => {
    const settings = useSettings();
    return <Component {...props} {...settings} />;
  };
};