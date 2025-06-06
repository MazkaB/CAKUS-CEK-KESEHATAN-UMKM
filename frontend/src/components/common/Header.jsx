// frontend/src/components/common/Header.jsx
import React from 'react';
import { Layout, Typography, Button, Space, Avatar, Dropdown, Menu } from 'antd';
import { UserOutlined, LogoutOutlined, SettingOutlined, BellOutlined } from '@ant-design/icons';

const { Header: AntHeader } = Layout;
const { Title } = Typography;

const Header = () => {
  const userMenu = (
    <Menu>
      <Menu.Item key="profile" icon={<UserOutlined />}>
        Profil
      </Menu.Item>
      <Menu.Item key="settings" icon={<SettingOutlined />}>
        Pengaturan
      </Menu.Item>
      <Menu.Divider />
      <Menu.Item key="logout" icon={<LogoutOutlined />}>
        Logout
      </Menu.Item>
    </Menu>
  );

  return (
    <AntHeader style={{ 
      background: '#fff', 
      padding: '0 24px', 
      borderBottom: '1px solid #f0f0f0',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center'
    }}>
      <div style={{ display: 'flex', alignItems: 'center' }}>
        <div style={{ 
          width: '40px', 
          height: '40px', 
          background: '#1890ff', 
          borderRadius: '8px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          marginRight: '12px'
        }}>
          <span style={{ color: 'white', fontWeight: 'bold', fontSize: '18px' }}>C</span>
        </div>
        <Title level={3} style={{ margin: 0, color: '#1890ff' }}>
          CAKUS
        </Title>
        <span style={{ 
          marginLeft: '8px', 
          fontSize: '12px', 
          color: '#666',
          background: '#f0f0f0',
          padding: '2px 8px',
          borderRadius: '4px'
        }}>
          v1.0
        </span>
      </div>

      <Space size="middle">
        <Button type="text" icon={<BellOutlined />} />
        
        <Dropdown overlay={userMenu} placement="bottomRight">
          <div style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}>
            <Avatar icon={<UserOutlined />} style={{ marginRight: '8px' }} />
            <span>Admin CAKUS</span>
          </div>
        </Dropdown>
      </Space>
    </AntHeader>
  );
};

export default Header;