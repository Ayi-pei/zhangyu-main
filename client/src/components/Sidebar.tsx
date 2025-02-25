import React from "react";
import { Link } from "react-router-dom";

const Sidebar = () => {
  return (
    <div className="bg-gray-800 w-64 min-h-screen text-white p-6">
      <h2 className="text-2xl mb-6">管理后台</h2>
      <ul>
        <li>
          <Link to="/admin" className="block mb-4 hover:bg-gray-700 p-2 rounded">
            首页
          </Link>
        </li>
        <li>
          <Link to="/admin/users" className="block mb-4 hover:bg-gray-700 p-2 rounded">
            用户管理
          </Link>
        </li>
        <li>
          <Link to="/admin/bets" className="block mb-4 hover:bg-gray-700 p-2 rounded">
            注单管理
          </Link>
        </li>
        <li>
          <Link to="/admin/stats" className="block mb-4 hover:bg-gray-700 p-2 rounded">
            统计数据
          </Link>
        </li>
      </ul>
    </div>
  );
};

export default Sidebar;
