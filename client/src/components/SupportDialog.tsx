import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { X, Send, MessageSquare, ArrowLeft } from 'lucide-react';
import './SupportDialog.css';

interface SupportDialogProps {
  onClose: () => void;
}

interface Message {
  sender: 'user' | 'support';
  text: string;
}

const SupportDialog: React.FC<SupportDialogProps> = ({ onClose }) => {
  const navigate = useNavigate();
  const [messages, setMessages] = useState<Message[]>([]);
  const [messageText, setMessageText] = useState('');
  const [qrCodeUrl, setQrCodeUrl] = useState<string>('');

  useEffect(() => {
    // 获取二维码 URL
    fetch('/api/qrcode')
      .then(response => response.json())
      .then(data => setQrCodeUrl(data.qrCodeUrl))
      .catch(error => console.error('Error fetching QR code:', error));
  }, []);

  const handleSendMessage = () => {
    if (messageText.trim()) {
      setMessages(prev => [...prev, { sender: 'user', text: messageText.trim() }]);
      setMessageText('');
    }
  };

  const handleSimulateResponse = () => {
    setMessages(prev => [
      ...prev,
      { sender: 'support', text: '안녕하세요, 무엇을 도와드릴까요?' }
    ]);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="support-dialog-container">
      <button
        type="button"
        onClick={() => navigate('/profile')}
        className="back-button"
      >
        <ArrowLeft className="w-5 h-5" />
        <span>返回个人中心</span>
      </button>

      <div className="support-dialog-card">
        <div className="dialog-header">
          <h3 className="dialog-title">联系客服</h3>
          <button
            type="button"
            onClick={onClose}
            className="close-button"
            aria-label="关闭对话"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="messages-container">
          {messages.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-gray-400">
              <MessageSquare className="w-12 h-12 mb-2" />
              <p>暂无消息</p>
            </div>
          ) : (
            messages.map((message, index) => (
              <div
                key={index}
                className={`message ${message.sender === 'user' ? 'user-message' : 'support-message'}`}
              >
                {message.text}
              </div>
            ))
          )}
        </div>

        <div className="input-container">
          <input
            type="text"
            value={messageText}
            onChange={(e) => setMessageText(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="输入消息..."
            className="message-input"
          />
          <div className="action-buttons">
            <button
              type="button"
              onClick={handleSendMessage}
              className="action-button send-button"
              disabled={!messageText.trim()}
              aria-label="发送消息"
            >
              <Send className="w-5 h-5" />
            </button>

            <button
              type="button"
              onClick={handleSimulateResponse}
              className="action-button simulate-button"
            >
              获取消息
            </button>
          </div>
        </div>

        {/* 社交媒体链接 */}
        <div className="social-links">
          <h4 className="text-lg font-bold mt-6">联系我们</h4>
          <div className="flex justify-center gap-4 mt-2">
            <a href="https://www.example.com/facebook" target="_blank" rel="noopener noreferrer" className="social-link">
              Facebook
            </a>
            <a href="https://www.example.com/whatsapp" target="_blank" rel="noopener noreferrer" className="social-link">
              WhatsApp
            </a>
          </div>
        </div>

        {/* 显示二维码 */}
        {qrCodeUrl && (
          <div className="qr-code-container mt-4">
            <h4 className="text-lg font-bold">扫描二维码联系客服</h4>
            <img src={qrCodeUrl} alt="QR Code" className="qr-code-image" />
          </div>
        )}
      </div>
    </div>
  );
};

export default SupportDialog;
