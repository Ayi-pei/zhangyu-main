import React, { useState, useEffect, useRef } from 'react';
import { Send, Paperclip, X } from 'lucide-react';
import { useTheme } from '../../theme/ThemeContext';
import './SupportChat.css';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'support';
  timestamp: Date;
}

export const SupportChat: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const chatRef = useRef<HTMLDivElement>(null);
  const { colors } = useTheme();

  useEffect(() => {
    // 添加欢迎消息
    setMessages([{
      id: '0',
      text: '您好！我是客服小助手，很高兴为您服务。',
      sender: 'support',
      timestamp: new Date()
    }]);
  }, []);

  useEffect(() => {
    // 滚动到最新消息
    if (chatRef.current) {
      chatRef.current.scrollTop = chatRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = () => {
    if (!input.trim()) return;

    // 添加用户消息
    const userMessage: Message = {
      id: Date.now().toString(),
      text: input,
      sender: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');

    // 模拟客服回复
    setTimeout(() => {
      const supportMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: '感谢您的咨询，我们会尽快处理您的问题。',
        sender: 'support',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, supportMessage]);
    }, 1000);
  };

  return (
    <div 
      className="support-chat"
      style={{ 
        backgroundColor: colors.surface,
        color: colors.text,
        borderColor: colors.border 
      }}
    >
      <div className="chat-header" style={{ backgroundColor: colors.primary }}>
        <h3>客服支持</h3>
        <button onClick={onClose}>
          <X size={20} />
        </button>
      </div>

      <div className="chat-messages" ref={chatRef}>
        {messages.map(message => (
          <div 
            key={message.id}
            className={`message ${message.sender}`}
            style={{
              backgroundColor: message.sender === 'user' ? colors.primary : colors.surface,
              color: message.sender === 'user' ? '#fff' : colors.text
            }}
          >
            <p>{message.text}</p>
            <span className="timestamp">
              {message.timestamp.toLocaleTimeString()}
            </span>
          </div>
        ))}
      </div>

      <div className="chat-input">
        <button className="attach-btn">
          <Paperclip size={20} />
        </button>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleSend()}
          placeholder="请输入您的问题..."
          style={{
            backgroundColor: colors.background,
            color: colors.text,
            borderColor: colors.border
          }}
        />
        <button 
          onClick={handleSend}
          className="send-btn"
          style={{ backgroundColor: colors.primary }}
        >
          <Send size={20} />
        </button>
      </div>
    </div>
  );
}; 