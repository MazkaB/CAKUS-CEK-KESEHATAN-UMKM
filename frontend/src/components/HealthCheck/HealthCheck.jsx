// frontend/src/components/HealthCheck/HealthCheck.jsx (FIXED ICONS)
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Card, Spin, Alert, Button, Row, Col, Progress, Statistic } from 'antd';
import { 
  HeartOutlined, // Changed from HealthCheckOutlined
  TrophyOutlined, 
  WarningOutlined,
  ReloadOutlined,
  MedicineBoxOutlined // Alternative health icon
} from '@ant-design/icons';
import { mlService } from '../../services/mlService';
import './HealthCheck.css';

const HealthCheck = () => {
  const { id } = useParams();
  const [loading, setLoading] = useState(true);
  const [healthData, setHealthData] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    checkUMKMHealth();
  }, [id]);

  const checkUMKMHealth = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await mlService.checkHealth(id);
      setHealthData(response.data);
    } catch (err) {
      setError('Gagal menganalisis kesehatan UMKM');
      console.error('Error checking health:', err);
    } finally {
      setLoading(false);
    }
  };

  const getRiskColor = (riskLevel) => {
    switch (riskLevel) {
      case 'rendah': return '#52c41a';
      case 'sedang': return '#faad14';
      case 'tinggi': return '#f5222d';
      default: return '#1890ff';
    }
  };

  const getHealthScore = (cluster) => {
    return cluster === 1 ? 75 : 45; // Cluster 1 = risiko rendah, Cluster 0 = risiko tinggi
  };

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '50px' }}>
        <Spin size="large" />
        <p style={{ marginTop: '16px' }}>Menganalisis kesehatan UMKM...</p>
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
          <Button size="small" danger onClick={checkUMKMHealth}>
            Coba Lagi
          </Button>
        }
      />
    );
  }

  const healthScore = getHealthScore(healthData.cluster);
  const riskLevel = healthData.cluster === 1 ? 'rendah' : 'tinggi';

  return (
    <div className="health-check">
      <Row gutter={24}>
        <Col span={24}>
          <Card 
            title={
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <HeartOutlined style={{ marginRight: '8px' }} />
                Hasil Analisis Kesehatan UMKM
              </div>
            }
            extra={
              <Button 
                icon={<ReloadOutlined />} 
                onClick={checkUMKMHealth}
              >
                Refresh Analisis
              </Button>
            }
          >
            <Row gutter={24}>
              <Col span={8}>
                <Card>
                  <Statistic
                    title="Skor Kesehatan"
                    value={healthScore}
                    suffix="/ 100"
                    valueStyle={{ color: getRiskColor(riskLevel) }}
                  />
                  <Progress 
                    percent={healthScore} 
                    strokeColor={getRiskColor(riskLevel)}
                    showInfo={false}
                  />
                </Card>
              </Col>
              <Col span={8}>
                <Card>
                  <Statistic
                    title="Tingkat Risiko Kredit"
                    value={riskLevel.toUpperCase()}
                    valueStyle={{ color: getRiskColor(riskLevel) }}
                    prefix={riskLevel === 'tinggi' ? <WarningOutlined /> : <TrophyOutlined />}
                  />
                </Card>
              </Col>
              <Col span={8}>
                <Card>
                  <Statistic
                    title="Cluster"
                    value={`Cluster ${healthData.cluster}`}
                    valueStyle={{ color: '#1890ff' }}
                  />
                  <p style={{ margin: '8px 0 0 0', fontSize: '12px', color: '#666' }}>
                    {healthData.cluster === 1 ? 'Performa Baik' : 'Perlu Perbaikan'}
                  </p>
                </Card>
              </Col>
            </Row>
          </Card>
        </Col>
      </Row>

      <Row gutter={24} style={{ marginTop: '24px' }}>
        <Col span={12}>
          <Card title="Analisis Keuangan">
            <Row gutter={16}>
              <Col span={12}>
                <Statistic
                  title="Aset"
                  value={healthData.umkm_data?.aset || 0}
                  formatter={(value) => `Rp ${value?.toLocaleString()}`}
                />
              </Col>
              <Col span={12}>
                <Statistic
                  title="Omset"
                  value={healthData.umkm_data?.omset || 0}
                  formatter={(value) => `Rp ${value?.toLocaleString()}`}
                />
              </Col>
            </Row>
            <Row gutter={16} style={{ marginTop: '16px' }}>
              <Col span={12}>
                <Statistic
                  title="Laba"
                  value={healthData.umkm_data?.laba || 0}
                  formatter={(value) => `Rp ${value?.toLocaleString()}`}
                />
              </Col>
              <Col span={12}>
                <Statistic
                  title="Margin Laba"
                  value={
                    healthData.umkm_data?.omset ? 
                    ((healthData.umkm_data.laba / healthData.umkm_data.omset) * 100).toFixed(1) : 0
                  }
                  suffix="%"
                />
              </Col>
            </Row>
          </Card>
        </Col>
        <Col span={12}>
          <Card title="Analisis Operasional">
            <Row gutter={16}>
              <Col span={12}>
                <Statistic
                  title="Kapasitas Produksi"
                  value={healthData.umkm_data?.kapasitas_produksi || 0}
                  suffix="unit"
                />
              </Col>
              <Col span={12}>
                <Statistic
                  title="Jumlah Pelanggan"
                  value={healthData.umkm_data?.jumlah_pelanggan || 0}
                />
              </Col>
            </Row>
            <Row gutter={16} style={{ marginTop: '16px' }}>
              <Col span={12}>
                <Statistic
                  title="Tenaga Kerja"
                  value={
                    (healthData.umkm_data?.tenaga_kerja_perempuan || 0) + 
                    (healthData.umkm_data?.tenaga_kerja_laki_laki || 0)
                  }
                  suffix="orang"
                />
              </Col>
              <Col span={8}>
                <Statistic
                  title="Usia Usaha"
                  value={healthData.umkm_data?.tahun_berdiri ? 2025 - healthData.umkm_data.tahun_berdiri : 0}
                  suffix="tahun"
                />
              </Col>
            </Row>
          </Card>
        </Col>
      </Row>

      <Row gutter={24} style={{ marginTop: '24px' }}>
        <Col span={24}>
          <Card title="Interpretasi Hasil">
            <div style={{ fontSize: '14px', lineHeight: '1.6' }}>
              {healthData.cluster === 1 ? (
                <Alert
                  message="UMKM Sehat - Risiko Kredit Rendah"
                  description={
                    <div>
                      <p>UMKM Anda berada dalam cluster dengan profil risiko rendah. Karakteristik yang mendukung:</p>
                      <ul>
                        <li>Kapasitas produksi dan jumlah pelanggan yang tinggi</li>
                        <li>Diversifikasi pasar yang baik</li>
                        <li>Stabilitas operasional yang terjaga</li>
                      </ul>
                      <p><strong>Rekomendasi:</strong> UMKM ini layak mendapat fasilitas kredit dengan suku bunga kompetitif dan limit yang fleksibel.</p>
                    </div>
                  }
                  type="success"
                  showIcon
                />
              ) : (
                <Alert
                  message="UMKM Perlu Perhatian - Risiko Kredit Tinggi"
                  description={
                    <div>
                      <p>UMKM Anda berada dalam cluster dengan profil risiko tinggi. Area yang perlu diperbaiki:</p>
                      <ul>
                        <li>Kapasitas produksi dan jumlah pelanggan yang terbatas</li>
                        <li>Skala operasi yang masih kecil</li>
                        <li>Perlu diversifikasi pasar yang lebih baik</li>
                      </ul>
                      <p><strong>Rekomendasi:</strong> Perlu monitoring intensif dan pembinaan sebelum pemberian kredit.</p>
                    </div>
                  }
                  type="warning"
                  showIcon
                />
              )}
            </div>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default HealthCheck;