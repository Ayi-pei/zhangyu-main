import { useState, useEffect } from 'react';
import { ArrowLeft, Calendar, TrendingUp, TrendingDown } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import './History.css';

interface JumpRecord {
  direction: string;
  steps: number;
  results: string[];
  timestamp: number;
  pointsEarned: number;
  status: 'pending' | 'completed';
}

const History = () => {
  const [records, setRecords] = useState<JumpRecord[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    const savedRecords = localStorage.getItem('jumpHistory');
    if (savedRecords) {
      setRecords(JSON.parse(savedRecords));
    }
  }, []);

  const formatTimestamp = (timestamp: number) => {
    const date = new Date(timestamp);
    return date.toLocaleString();
  };

  return (
    <div className="history-container">
      <div className="history-header">
        <button
          onClick={() => navigate(-1)}
          className="back-button"
          type="button"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>返回</span>
        </button>
        <h1>历史记录</h1>
      </div>

      <div className="records-container">
        {records.length === 0 ? (
          <div className="empty-state">
            <Calendar className="w-16 h-16 text-gray-400" />
            <p>暂无记录</p>
          </div>
        ) : (
          <div className="records-list">
            {records.map((record, index) => (
              <div key={index} className="record-card">
                <div className="record-header">
                  <span className="record-direction">{record.direction}</span>
                  <span className={`record-points ${record.pointsEarned >= 0 ? 'positive' : 'negative'}`}>
                    {record.pointsEarned >= 0 ? (
                      <TrendingUp className="w-4 h-4" />
                    ) : (
                      <TrendingDown className="w-4 h-4" />
                    )}
                    {record.pointsEarned >= 0 ? '+' : ''}{record.pointsEarned}
                  </span>
                </div>
                <div className="record-details">
                  <div className="detail-item">
                    <span className="detail-label">投注</span>
                    <span className="detail-value">{record.steps}</span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-label">结果</span>
                    <span className="detail-value">
                      {record.status === 'completed' ? record.results.join(' ') : '等待中'}
                    </span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-label">时间</span>
                    <span className="detail-value timestamp">
                      {formatTimestamp(record.timestamp)}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default History;