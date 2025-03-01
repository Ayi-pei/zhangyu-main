import type { ReactNode } from 'react';
import { Button } from 'antd';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  onPageChange,
}: PaginationProps) => {
  const handlePrevPage = () => {
    if (currentPage > 1) {
      onPageChange(currentPage - 1);
    }
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      onPageChange(currentPage + 1);
    }
  };

  return (
    <div className="flex justify-between items-center">
      <button onClick={handlePrevPage} disabled={currentPage === 1} className="btn">
        上一页
      </button>
      <span>
        第 {currentPage} 页 / 共 {totalPages} 页
      </span>
      <button onClick={handleNextPage} disabled={currentPage === totalPages} className="btn">
        下一页
      </button>
    </div>
  );
};
