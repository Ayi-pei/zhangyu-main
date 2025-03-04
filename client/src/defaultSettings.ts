export interface Settings {
  theme: 'light' | 'dark';
  language: 'zh_CN' | 'en_US';
  colorPrimary: string;
  layout: 'side' | 'top';
}

export const defaultSettings: Settings = {
  theme: 'light',
  language: 'zh_CN',
  colorPrimary: '#1890ff',
  layout: 'side',
}; 