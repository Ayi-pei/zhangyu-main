// FILEPATH: d:/ayi/zhangyu-main/client/src/components/SupportDialog.tsx

import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Input, Avatar, Tooltip, message } from 'antd';
import { SendOutlined, UserOutlined, CustomerServiceOutlined } from '@ant-design/icons';
import styled from 'styled-components';
import { useTheme } from '../context/ThemeContext';

const DialogContainer = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
  background-color: ${props => props.theme === 'dark' ? '#1f1f1f' : '#ffffff'};
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);

  @media (max-width: 768px) {
    padding: 10px;
  }
`;

const DialogHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
`;

const MessagesContainer = styled.div`
  flex: 1;
  overflow-y: auto;
  padding: 10px;
  border: 1px solid ${props => props.theme === 'dark' ? '#434343' : '#d9d9d9'};
  border-radius: 4px;
  margin-bottom: 20px;
`;

const MessageBubble = styled.div`
  max-width: 70%;
  padding: 10px;
  border-radius: 18px;
  margin-bottom: 10px;
  word-wrap: break-word;
`;

const UserMessage = styled(MessageBubble)`
  background-color: #1890ff;
  color: white;
  align-self: flex-end;
  margin-left: auto;
`;

const SupportMessage = styled(MessageBubble)`
  background-color: ${props => props.theme === 'dark' ? '#424242' : '#f0f0f0'};
  color: ${props => props.theme === 'dark' ? '#ffffff' : '#000000'};
`;

const InputContainer = styled.div`
  display: flex;
  align-items: center;
`;

const StyledInput = styled(Input)`
  flex: 1;
  margin-right: 10px;
`;

interface SupportDialogProps {
  onClose: () => void;
}

interface Message {
  id: number;
  sender: 'user' | 'support';
  text: string;
  timestamp: Date;
}

const SupportDialog: React.FC<SupportDialogProps> = ({ onClose }) => {
  const navigate = useNavigate();
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState('');
  const messagesEndRef = useRef<null | HTMLDivElement>(null);
  const { themeMode } = useTheme();

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleSendMessage = () => {
    if (inputText.trim()) {
      const newMessage: Message = {
        id: Date.now(),
        sender: 'user',
        text: inputText.trim(),
        timestamp: new Date(),
      };
      setMessages(prevMessages => [...prevMessages, newMessage]);
      setInputText('');
      simulateSupportResponse();
    }
  };

  const simulateSupportResponse = () => {
    setTimeout(() => {
      const supportMessage: Message = {
        id: Date.now(),
        sender: 'support',
        text: '感谢您的咨询。我们的客服人员将尽快回复您的问题。',
        timestamp: new Date(),
      };
      setMessages(prevMessages => [...prevMessages, supportMessage]);
    }, 1000);
  };

  return (
    <DialogContainer theme={themeMode}>
      <DialogHeader>
        <h2>客户支持</h2>
        <Button onClick={onClose}>关闭</Button>
      </DialogHeader>
      <MessagesContainer theme={themeMode}>
        {messages.map((message) => (
          <div key={message.id} style={{ display: 'flex', justifyContent: message.sender === 'user' ? 'flex-end' : 'flex-start' }}>
            {message.sender === 'support' && (
              <Avatar icon={<CustomerServiceOutlined />} style={{ marginRight: '10px' }} />
            )}
            <Tooltip title={message.timestamp.toLocaleString()}>
              {message.sender === 'user' ? (
                <UserMessage>{message.text}</UserMessage>
              ) : (
                <SupportMessage theme={themeMode}>{message.text}</SupportMessage>
              )}
            </Tooltip>
            {message.sender === 'user' && (
              <Avatar icon={<UserOutlined />} style={{ marginLeft: '10px' }} />
            )}
          </div>
        ))}
        <div ref={messagesEndRef} />
      </MessagesContainer>
      <InputContainer>
        <StyledInput
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          onPressEnter={handleSendMessage}
          placeholder="输入您的问题..."
        />
        <Button type="primary" icon={<SendOutlined />} onClick={handleSendMessage}>
          发送
        </Button>
      </InputContainer>
    </DialogContainer>
  );
};

export default SupportDialog;
