// FILEPATH: d:/ayi/zhangyu-main/client/src/components/LoadingIndicator.tsx

import React from 'react';
import { Spin } from 'antd';
import { LoadingOutlined } from '@ant-design/icons';

const LoadingIndicator: React.FC = () => (
  <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
    <Spin indicator={<LoadingOutlined style={{ fontSize: 24 }} spin />} />
  </div>
);

export default LoadingIndicator;
