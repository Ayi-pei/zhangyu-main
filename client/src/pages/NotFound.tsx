// src/pages/NotFound.tsx
import '../components/NotFound.css'; // 导入外部样式

const NotFound: React.FC = () => {
  return (
    <div className="notfound-container">
      <h1>404 - 页面未找到</h1>
      <p>抱歉，您访问的页面不存在。</p>
    </div>
  );
};

export default NotFound;
