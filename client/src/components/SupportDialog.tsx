// FILEPATH: d:/ayi/zhangyu-main/client/src/components/SupportDialog.tsx

import React from 'react';
import styled from 'styled-components';
import { useTheme } from '../context/ThemeContext';

interface ThemeProps {
  $themeMode: 'light' | 'dark';
}

const DialogContainer = styled.div<ThemeProps>`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 1000;
`;

const DialogContent = styled.div<ThemeProps>`
  background: ${props => props.$themeMode === 'dark' ? '#1f1f1f' : '#ffffff'};
  padding: 2rem;
  border-radius: 8px;
  max-width: 500px;
  width: 90%;
`;

const DialogHeader = styled.div<ThemeProps>`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
  color: ${props => props.$themeMode === 'dark' ? '#ffffff' : '#000000'};
`;

const DialogBody = styled.div<ThemeProps>`
  margin-bottom: 1.5rem;
  color: ${props => props.$themeMode === 'dark' ? '#cccccc' : '#333333'};
`;

const DialogFooter = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
`;

const Button = styled.button<ThemeProps & { $primary?: boolean }>`
  padding: 0.5rem 1rem;
  border-radius: 4px;
  border: none;
  cursor: pointer;
  background: ${props => props.$primary ? '#1890ff' : props.$themeMode === 'dark' ? '#333333' : '#f0f0f0'};
  color: ${props => props.$primary ? '#ffffff' : props.$themeMode === 'dark' ? '#ffffff' : '#000000'};

  &:hover {
    opacity: 0.8;
  }
`;

interface SupportDialogProps {
  onClose: () => void;
}

export const SupportDialog: React.FC<SupportDialogProps> = ({ onClose }) => {
  const { themeMode } = useTheme();

  return (
    <DialogContainer $themeMode={themeMode}>
      <DialogContent $themeMode={themeMode}>
        <DialogHeader $themeMode={themeMode}>
          <h2>客服支持</h2>
          <Button $themeMode={themeMode} onClick={onClose}>×</Button>
        </DialogHeader>
        <DialogBody $themeMode={themeMode}>
          <p>客服热线：400-xxx-xxxx</p>
          <p>在线时间：9:00-22:00</p>
          <p>邮箱：support@example.com</p>
        </DialogBody>
        <DialogFooter>
          <Button $themeMode={themeMode} onClick={onClose}>取消</Button>
          <Button $primary $themeMode={themeMode} onClick={onClose}>确定</Button>
        </DialogFooter>
      </DialogContent>
    </DialogContainer>
  );
};
