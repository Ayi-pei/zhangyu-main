// src/admin/AdminResults.tsx
// src/admin/AdminResults.tsx
import React, { useState, useEffect } from "react";
import TopBar from "../components/TopBar";
import Sidebar from "../components/Sidebar";
import { getResults } from "../api/uresApi";

interface AdminResult {
  id: number;
  username: string;
  amount: number;
  result: string;
}

interface AdminResultsProps {
  userRole: string;
}

const AdminResults: React.FC<AdminResultsProps> = ({ userRole }) => {
  const [results, setResults] = useState<AdminResult[]>([]);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [resultsPerPage] = useState<number>(10);
  const [totalCount, setTotalCount] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchResults = async () => {
      setLoading(true);
      try {
        const { results: fetchedResults, totalCount } = await getResults(currentPage, resultsPerPage);
        setResults(fetchedResults || []);
        setTotalCount(totalCount || 0);
      } catch (error) {
        console.error("Error fetching results:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchResults();
  }, [currentPage, resultsPerPage]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleSearch = (query: string) => {
    console.log("Search query:", query);
  };

  return (
    <div className="flex">
      <Sidebar />
      <div className="flex-1 p-6 bg-gray-900 text-white">
        <TopBar onSearch={handleSearch} />
        <div className="p-4 bg-gray-800 rounded-lg mb-6">
          <h2 className="text-xl mb-3">投注结果管理</h2>
          <table className="w-full">
            <thead>
              <tr>
                <th className="text-left p-2">用户</th>
                <th className="text-left p-2">金额</th>
                <th className="text-left p-2">结果</th>
                <th className="text-left p-2">操作</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={4} className="text-center p-2">
                    加载中...
                  </td>
                </tr>
              ) : results.length > 0 ? (
                results.map((result) => (
                  <tr key={result.id}>
                    <td className="p-2">{result.username}</td>
                    <td className="p-2">{result.amount} 元</td>
                    <td className="p-2">{result.result}</td>
                    <td className="p-2">
                      {userRole !== "viewer" && (
                        <button
                          onClick={() => alert(`审核 ${result.id}`)}
                          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-2 rounded"
                        >
                          审核
                        </button>
                      )}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={4} className="text-center p-2">
                    无记录
                  </td>
                </tr>
              )}
            </tbody>
          </table>
          <div className="mt-4">
            {/* 简化的分页控件 */}
            <div className="flex justify-between items-center">
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="bg-gray-700 text-white px-4 py-2 rounded disabled:opacity-50"
              >
                上一页
              </button>
              <span>第 {currentPage} 页，共 {Math.ceil(totalCount / resultsPerPage)} 页</span>
              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage * resultsPerPage >= totalCount}
                className="bg-gray-700 text-white px-4 py-2 rounded disabled:opacity-50"
              >
                下一页
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminResults;