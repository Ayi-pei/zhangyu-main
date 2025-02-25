import React from "react";

function TopBar({ onSearch }: { onSearch: (query: string) => void }) {
  return (
    <div className="bg-gray-800 p-4 flex justify-between items-center">
      <h1 className="text-white text-xl font-bold">管理后台</h1>
      <input
        type="text"
        placeholder="搜索用户或金额"
        className="px-3 py-1 rounded bg-gray-700 text-white border border-gray-600"
        onChange={(e) => onSearch(e.target.value)}
      />
      <button 
        type="button" 
        className="bg-red-500 px-3 py-1 text-white rounded"
      >
        退出
      </button>
    </div>
  );
}

export default TopBar;