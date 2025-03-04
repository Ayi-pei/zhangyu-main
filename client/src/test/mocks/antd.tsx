import React from 'react';

// Mock Ant Design's ConfigProvider
export const ConfigProvider = ({ children }: { children: React.ReactNode }) => {
  return <>{children}</>;
};

// Mock theme object
export const theme = {
  defaultAlgorithm: 'default',
  darkAlgorithm: 'dark'
}; 