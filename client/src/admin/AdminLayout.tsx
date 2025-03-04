import React, { ReactNode, useState, useEffect } from "react";
import TopBar from "../components/TopBar";
import Sidebar from "../components/Sidebar";
import "../styles/AdminLayout.css"; // 引入样式

interface AdminLayoutProps {
  children: ReactNode;
}

const AdminLayout: React.FC<AdminLayoutProps> = ({ children }) => {
  const [theme, setTheme] = useState("dark"); // 主题状态

  useEffect(() => {
    document.documentElement.classList.remove("dark", "light", "business", "soft");
    document.documentElement.classList.add(theme);
  }, [theme]);

  const handleSearch = (query: string) => {
    // 实现搜索逻辑
    console.log("Searching for:", query);
  };

  return (
    <div className="flex">
      <Sidebar />
      <div className="flex-1 p-6 bg-gray-900 text-white">
        <TopBar onSearch={handleSearch} />
        {/* 主题切换 */}
        <div className="mb-4">
          <label htmlFor="themeSelect" className="mr-2 text-lg">选择主题: </label>
          <select
            id="themeSelect"
            className="p-2 bg-gray-700 text-white"
            value={theme}
            onChange={(e) => setTheme(e.target.value)}
          >
            <option value="dark">暗黑</option>
            <option value="light">明亮</option>
            <option value="business">商务</option>
            <option value="soft">柔和</option>
          </select>
        </div>
        {/* 渲染子组件 */}
        <div className="mt-6">{children}</div>
      </div>
    </div>
  );
};

export default AdminLayout;