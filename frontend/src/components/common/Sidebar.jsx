import React from 'react';
import { Layout, Menu } from 'antd';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  DashboardOutlined,
  PlusOutlined,
  HeartOutlined, // Changed from HealthCheckOutlined
  BulbOutlined,
  EnvironmentOutlined,
  BarChartOutlined,
  SettingOutlined,
  MedicineBoxOutlined // Alternative health icon
} from '@ant-design/icons';

const { Sider } = Layout;

const Sidebar = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const menuItems = [
    {
      key: '/',
      icon: <DashboardOutlined />,
      label: 'Dashboard',
    },
    {
      key: '/register-umkm',
      icon: <PlusOutlined />,
      label: 'Registrasi UMKM',
    },
    {
      key: 'health',
      icon: <HeartOutlined />, // Changed from HealthCheckOutlined
      label: 'Cek Kesehatan',
      children: [
        {
          key: '/health-check',
          label: 'Analisis Kesehatan',
        },
        {
          key: '/health-reports',
          label: 'Laporan Kesehatan',
        }
      ]
    },
    {
      key: 'recommendations',
      icon: <BulbOutlined />,
      label: 'Rekomendasi',
      children: [
        {
          key: '/recommendations',
          label: 'Rekomendasi Bisnis',
        },
        {
          key: '/location-recommendation',
          label: 'Rekomendasi Lokasi',
        }
      ]
    },
    {
      key: '/analytics',
      icon: <BarChartOutlined />,
      label: 'Analytics',
    },
    {
      key: '/settings',
      icon: <SettingOutlined />,
      label: 'Pengaturan',
    }
  ];

  const handleMenuClick = ({ key }) => {
    navigate(key);
  };

  return (
    <Sider width={250} style={{ background: '#fff', borderRight: '1px solid #f0f0f0' }}>
      <Menu
        mode="inline"
        selectedKeys={[location.pathname]}
        defaultOpenKeys={['health', 'recommendations']}
        style={{ height: '100%', borderRight: 0 }}
        items={menuItems}
        onClick={handleMenuClick}
      />
    </Sider>
  );
};

export default Sidebar;