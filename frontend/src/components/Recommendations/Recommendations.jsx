// frontend/src/components/Recommendations/Recommendations.jsx (FIXED ICONS)
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Card, Spin, Alert, Button, Row, Col, List, Tag, Divider, Collapse } from 'antd';
import { 
  BulbOutlined, 
  DollarOutlined, 
  ShopOutlined, 
  TrophyOutlined,
  SafetyOutlined,
  RocketOutlined,
  ReloadOutlined
} from '@ant-design/icons';
import { mlService } from '../../services/mlService';
import './Recommendations.css';

const { Panel } = Collapse;

const Recommendations = () => {
  const { id } = useParams();
  const [loading, setLoading] = useState(true);
  const [recommendations, setRecommendations] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchRecommendations();
  }, [id]);

  const fetchRecommendations = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await mlService.getRecommendations(id);
      setRecommendations(response.data);
    } catch (err) {
      setError('Gagal mengambil rekomendasi');
      console.error('Error fetching recommendations:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '50px' }}>
        <Spin size="large" />
        <p style={{ marginTop: '16px' }}>Menganalisis dan membuat rekomendasi...</p>
      </div>
    );
  }

  if (error) {
    return (
      <Alert
        message="Error"
        description={error}
        type="error"
        showIcon
        action={
          <Button size="small" danger onClick={fetchRecommendations}>
            Coba Lagi
          </Button>
        }
      />
    );
  }

  const categoryIcons = {
    'strategi_keuangan': <DollarOutlined />,
    'operasional_produksi': <ShopOutlined />,
    'pemasaran_penjualan': <TrophyOutlined />,
    'manajemen_risiko': <SafetyOutlined />,
    'pengembangan_jangka_panjang': <RocketOutlined />
  };

  const categoryTitles = {
    'strategi_keuangan': 'Strategi Keuangan',
    'operasional_produksi': 'Operasional & Produksi',
    'pemasaran_penjualan': 'Pemasaran & Penjualan',
    'manajemen_risiko': 'Manajemen Risiko',
    'pengembangan_jangka_panjang': 'Pengembangan Jangka Panjang'
  };

  const getRiskColor = (riskLevel) => {
    switch (riskLevel) {
      case 'rendah': return '#52c41a';
      case 'sedang': return '#faad14';
      case 'tinggi': return '#f5222d';
      default: return '#1890ff';
    }
  };

  return (
    <div className="recommendations">
      <Row gutter={24}>
        <Col span={24}>
          <Card 
            title={
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <BulbOutlined style={{ marginRight: '8px' }} />
                Rekomendasi Bisnis Berbasis AI
              </div>
            }
            extra={
              <Button 
                icon={<ReloadOutlined />} 
                onClick={fetchRecommendations}
              >
                Refresh Rekomendasi
              </Button>
            }
          >
            {/* Cluster Info Summary */}
            <Row gutter={24} style={{ marginBottom: '24px' }}>
              <Col span={8}>
                <Card size="small">
                  <div style={{ textAlign: 'center' }}>
                    <h3>Cluster</h3>
                    <Tag color={recommendations.cluster_info.cluster === 1 ? 'green' : 'orange'}>
                      Cluster {recommendations.cluster_info.cluster}
                    </Tag>
                    <p style={{ margin: '8px 0 0 0', fontSize: '12px' }}>
                      {recommendations.cluster_info.cluster === 1 ? 'Performa Baik' : 'Perlu Perbaikan'}
                    </p>
                  </div>
                </Card>
              </Col>
              <Col span={8}>
                <Card size="small">
                  <div style={{ textAlign: 'center' }}>
                    <h3>Health Score</h3>
                    <div style={{ 
                      fontSize: '24px', 
                      fontWeight: 'bold',
                      color: getRiskColor(recommendations.cluster_info.risk_level)
                    }}>
                      {recommendations.cluster_info.health_score}/100
                    </div>
                  </div>
                </Card>
              </Col>
              <Col span={8}>
                <Card size="small">
                  <div style={{ textAlign: 'center' }}>
                    <h3>Risk Level</h3>
                    <Tag color={getRiskColor(recommendations.cluster_info.risk_level)}>
                      {recommendations.cluster_info.risk_level.toUpperCase()}
                    </Tag>
                  </div>
                </Card>
              </Col>
            </Row>

            <Divider />

            {/* Recommendations by Category */}
            <Collapse defaultActiveKey={['1']} size="large">
              {Object.entries(recommendations.recommendations).map(([category, items], index) => (
                <Panel 
                  header={
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                      {categoryIcons[category]}
                      <span style={{ marginLeft: '8px' }}>{categoryTitles[category]}</span>
                      <Tag style={{ marginLeft: '8px' }}>{items.length} rekomendasi</Tag>
                    </div>
                  } 
                  key={index + 1}
                >
                  <List
                    size="small"
                    dataSource={items}
                    renderItem={(item, itemIndex) => (
                      <List.Item>
                        <div style={{ width: '100%' }}>
                          <div style={{ display: 'flex', alignItems: 'flex-start' }}>
                            <div style={{ 
                              background: '#f0f0f0', 
                              borderRadius: '50%', 
                              width: '24px', 
                              height: '24px', 
                              display: 'flex', 
                              alignItems: 'center', 
                              justifyContent: 'center',
                              marginRight: '12px',
                              fontSize: '12px',
                              fontWeight: 'bold'
                            }}>
                              {itemIndex + 1}
                            </div>
                            <div style={{ flex: 1 }}>
                              <p style={{ margin: 0, lineHeight: '1.5' }}>{item}</p>
                            </div>
                          </div>
                        </div>
                      </List.Item>
                    )}
                  />
                </Panel>
              ))}
            </Collapse>

            {/* Additional Info */}
            <div style={{ marginTop: '24px', padding: '16px', background: '#f9f9f9', borderRadius: '8px' }}>
              <h4 style={{ margin: '0 0 8px 0' }}>📊 Catatan Analisis:</h4>
              <p style={{ margin: 0, fontSize: '14px', color: '#666' }}>
                Rekomendasi ini dihasilkan berdasarkan analisis clustering dengan algoritma K-Means dan 
                diperkaya dengan AI untuk memberikan saran bisnis yang lebih spesifik dan actionable. 
                Implementasikan rekomendasi secara bertahap dan sesuaikan dengan kondisi spesifik bisnis Anda.
              </p>
            </div>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default Recommendations;