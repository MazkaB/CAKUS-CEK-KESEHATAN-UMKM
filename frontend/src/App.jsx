import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Layout } from 'antd';
import Header from './components/common/Header';
import Sidebar from './components/common/Sidebar';
import Dashboard from './components/Dashboard/Dashboard';
import UMKMForm from './components/UMKMForm/UMKMForm';
import HealthCheck from './components/HealthCheck/HealthCheck';
import Recommendations from './components/Recommendations/Recommendations';
import LocationRecommendation from './components/LocationRecommendation/LocationRecommendation';
import './App.css';

const { Content } = Layout;

function App() {
  return (
    <Router>
      <Layout style={{ minHeight: '100vh' }}>
        <Header />
        <Layout>
          <Sidebar />
          <Layout style={{ padding: '24px' }}>
            <Content style={{ 
              padding: 24, 
              margin: 0, 
              minHeight: 280,
              background: '#fff',
              borderRadius: '8px'
            }}>
              <Routes>
                <Route path="/" element={<Dashboard />} />
                <Route path="/register-umkm" element={<UMKMForm />} />
                <Route path="/health-check/:id" element={<HealthCheck />} />
                <Route path="/health-check" element={<HealthCheckList />} />
                <Route path="/recommendations/:id" element={<Recommendations />} />
                <Route path="/recommendations" element={<RecommendationsList />} />
                <Route path="/location-recommendation" element={<LocationRecommendation />} />
                <Route path="/analytics" element={<Analytics />} />
                <Route path="/settings" element={<Settings />} />
              </Routes>
            </Content>
          </Layout>
        </Layout>
      </Layout>
    </Router>
  );
}

// Placeholder components for missing routes
const HealthCheckList = () => (
  <div style={{ textAlign: 'center', padding: '50px' }}>
    <h2>Daftar Health Check</h2>
    <p>Fitur ini akan menampilkan daftar semua health check yang pernah dilakukan.</p>
  </div>
);

const RecommendationsList = () => (
  <div style={{ textAlign: 'center', padding: '50px' }}>
    <h2>Daftar Rekomendasi</h2>
    <p>Fitur ini akan menampilkan daftar semua rekomendasi yang pernah dibuat.</p>
  </div>
);

const Analytics = () => (
  <div style={{ textAlign: 'center', padding: '50px' }}>
    <h2>Analytics Dashboard</h2>
    <p>Fitur analytics untuk analisis mendalam data UMKM.</p>
  </div>
);

const Settings = () => (
  <div style={{ textAlign: 'center', padding: '50px' }}>
    <h2>Pengaturan</h2>
    <p>Pengaturan aplikasi dan konfigurasi sistem.</p>
  </div>
);

export default App;