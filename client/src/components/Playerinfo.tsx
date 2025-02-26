import React from 'react';
import { Typography } from 'antd';
import Playerinfo from '../components/Playerinfo';

const { Title } = Typography;

const ProfilePage: React.FC = () => {
  return (
    <div>
      <Title level={2} style={{ textAlign: 'center', marginBottom: 24 }}>Player Profile</Title>
      <Playerinfo />
    </div>
  );
};

export default ProfilePage;
