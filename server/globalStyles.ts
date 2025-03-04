// FILEPATH: d:/ayi/zhangyu-main/client/src/styles/globalStyles.ts

import { createGlobalStyle } from 'styled-components';

export const GlobalStyles = createGlobalStyle<{ theme: 'light' | 'dark' }>`
  body {
    background-color: ${({ theme }) => (theme === 'dark' ? '#141414' : '#f0f2f5')};
    color: ${({ theme }) => (theme === 'dark' ? '#ffffff' : '#000000')};
  }

  .ant-layout {
    background-color: ${({ theme }) => (theme === 'dark' ? '#141414' : '#f0f2f5')};
  }

  .ant-layout-sider {
    background-color: ${({ theme }) => (theme === 'dark' ? '#001529' : '#ffffff')};
  }

  .ant-menu {
    background-color: ${({ theme }) => (theme === 'dark' ? '#001529' : '#ffffff')};
    color: ${({ theme }) => (theme === 'dark' ? '#ffffff' : '#000000')};
  }

  .ant-menu-item-selected {
    background-color: ${({ theme }) => (theme === 'dark' ? '#1890ff' : '#e6f7ff')};
  }
`;
