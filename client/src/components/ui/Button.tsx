import React from 'react';
import { Button as AntButton, ButtonProps } from 'antd';
import Icon from '@ant-design/icons';

interface ExtendedButtonProps extends Omit<ButtonProps, 'type'> {
  variant?: 'outline' | 'outlined' | 'text';
  size?: 'sm' | 'small' | 'large';
  leftIcon?: React.ReactNode;
}

export const Button: React.FC<ExtendedButtonProps> = ({ 
  variant, 
  size, 
  leftIcon,
  children,
  ...props 
}) => {
  const type = variant === 'outline' ? 'outlined' : variant;
  const buttonSize = size === 'sm' ? 'small' : size;

  return (
    <AntButton 
      {...props} 
      type={type} 
      size={buttonSize}
      icon={leftIcon && <Icon component={() => leftIcon} />}
    >
      {children}
    </AntButton>
  );
};

export default Button; 