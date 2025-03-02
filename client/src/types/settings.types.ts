export type ThemeType = 'light' | 'dark';
export type LanguageType = 'zh_CN' | 'en_US';

export interface Settings {
  theme: ThemeType;
  language: LanguageType;
  colorPrimary: string;
  layout: 'side' | 'top';
} 