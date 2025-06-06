// frontend/src/components/LocationRecommendation/LocationRecommendation.jsx
import React, { useState } from 'react';
import { Card, Form, Select, InputNumber, Button, Row, Col, List, Tag, Alert, Spin } from 'antd';
import { EnvironmentOutlined, DollarOutlined, TeamOutlined, ShopOutlined } from '@ant-design/icons';
import { mlService } from '../../services/mlService';
import './LocationRecommendation.css';

const { Option } = Select;

const LocationRecommendation = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [recommendations, setRecommendations] = useState(null);

  const jenisUsahaOptions = [
    'Fashion', 'Jasa', 'Kesehatan', 'Makanan & Minuman', 
    'Pendidikan', 'Perdagangan', 'Perusahaan'
  ];

  const onFinish = async (values) => {
    setLoading(true);
    try {
      const response = await mlService.getLocationRecommendations(values);
      setRecommendations(response.data.data);
    } catch (error) {
      console.error('Error getting location recommendations:', error);
      // Show sample data for demo
      setRecommendations(getSampleLocationData(values.jenis_usaha));
    } finally {
      setLoading(false);
    }
  };

  const getSampleLocationData = (jenisUsaha) => ({
    recommendations: [
      {
        city: "Jakarta",
        area_name: "Menteng",
        area_type: "Premium",
        rent_cost_category: "Tinggi",
        compatibility_score: 85.2,
        reasons: ["Area komersial dengan traffic tinggi", "Dekat dengan pusat bisnis", "Target market premium"],
        estimated_foot_traffic: "Tinggi",
        target_market: "Kalangan menengah atas",
        competition_level: "Sedang"
      },
      {
        city: "Jakarta",
        area_name: "Kemang",
        area_type: "Trendy",
        rent_cost_category: "Sedang-Tinggi",
        compatibility_score: 82.1,
        reasons: ["Area trendy dan lifestyle", "Banyak cafe dan restoran", "Target market anak muda"],
        estimated_foot_traffic: "Tinggi",
        target_market: "Anak muda, professional",
        competition_level: "Tinggi"
      },
      {
        city: "Bandung",
        area_name: "Dago",
        area_type: "Trendy",
        rent_cost_category: "Sedang",
        compatibility_score: 78.5,
        reasons: ["Kawasan wisata kuliner", "Akses mudah dari pusat kota", "Biaya sewa terjangkau"],
        estimated_foot_traffic: "Sedang-Tinggi",
        target_market: "Wisatawan, local residents",
        competition_level: "Sedang"
      }
    ],
    market_analysis: {
      market_trends: ["Digital adoption", "Sustainable business", "Local brand preference"],
      key_challenges: ["Competition", "Rising costs", "Customer acquisition"],
      business_opportunities: ["E-commerce integration", "Partnership opportunities", "Market expansion"],
      budget_recommendations: ["Pilih lokasi strategis dengan ROI yang baik", "Investasi dalam branding"],
      market_size_indicator: "Growing"
    },
    business_type: jenisUsaha,
    budget_category: "Sedang"
  });

  const getScoreColor = (score) => {
    if (score >= 80) return '#52c41a';
    if (score >= 70) return '#faad14';
    return '#f5222d';
  };

  const getRentCostColor = (cost) => {
    const colors = {
      'Rendah': '#52c41a',
      'Rendah-Sedang': '#73d13d',
      'Sedang': '#faad14',
      'Sedang-Tinggi': '#ffa940',
      'Tinggi': '#f5222d'
    };
    return colors[cost] || '#1890ff';
  };

  return (
    <div className="location-recommendation">
      <Row gutter={24}>
        <Col span={8}>
          <Card title="Parameter Rekomendasi Lokasi">
            <Form
              form={form}
              layout="vertical"
              onFinish={onFinish}
              size="large"
            >
              <Form.Item
                label="Jenis Usaha"
                name="jenis_usaha"
                rules={[{ required: true, message: 'Jenis usaha wajib dipilih!' }]}
              >
                <Select placeholder="Pilih jenis usaha">
                  {jenisUsahaOptions.map(jenis => (
                    <Option key={jenis} value={jenis}>{jenis}</Option>
                  ))}
                </Select>
              </Form.Item>

              <Form.Item
                label="Aset (IDR)"
                name="aset"
                rules={[{ required: true, message: 'Jumlah aset wajib diisi!' }]}
              >
                <InputNumber
                  min={0}
                  style={{ width: '100%' }}
                  placeholder="Masukkan jumlah aset"
                  formatter={value => `Rp ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                  parser={value => value.replace(/Rp\s?|(,*)/g, '')}
                />
              </Form.Item>

              <Form.Item
                label="Omset Bulanan (IDR)"
                name="omset"
                rules={[{ required: true, message: 'Omset wajib diisi!' }]}
              >
                <InputNumber
                  min={0}
                  style={{ width: '100%' }}
                  placeholder="Masukkan omset bulanan"
                  formatter={value => `Rp ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                  parser={value => value.replace(/Rp\s?|(,*)/g, '')}
                />
              </Form.Item>

              <Form.Item
                label="Lokasi Saat Ini"
                name="current_location"
                initialValue="Jakarta"
              >
                <Select>
                  <Option value="Jakarta">Jakarta</Option>
                  <Option value="Surabaya">Surabaya</Option>
                  <Option value="Bandung">Bandung</Option>
                  <Option value="Yogyakarta">Yogyakarta</Option>
                  <Option value="Semarang">Semarang</Option>
                </Select>
              </Form.Item>

              <Form.Item>
                <Button
                  type="primary"
                  htmlType="submit"
                  loading={loading}
                  block
                  size="large"
                  icon={<EnvironmentOutlined />}
                >
                  Cari Rekomendasi Lokasi
                </Button>
              </Form.Item>
            </Form>
          </Card>
        </Col>

        <Col span={16}>
          {loading && (
            <div style={{ textAlign: 'center', padding: '50px' }}>
              <Spin size="large" />
              <p style={{ marginTop: '16px' }}>Menganalisis lokasi terbaik untuk bisnis Anda...</p>
            </div>
          )}

          {recommendations && !loading && (
            <>
              {/* Market Analysis */}
              <Card title="Analisis Pasar" style={{ marginBottom: '16px' }}>
                <Row gutter={16}>
                  <Col span={12}>
                    <h4>📈 Tren Pasar</h4>
                    <ul>
                      {recommendations.market_analysis.market_trends.map((trend, index) => (
                        <li key={index}>{trend}</li>
                      ))}
                    </ul>
                  </Col>
                  <Col span={12}>
                    <h4>💡 Peluang Bisnis</h4>
                    <ul>
                      {recommendations.market_analysis.business_opportunities.map((opportunity, index) => (
                        <li key={index}>{opportunity}</li>
                      ))}
                    </ul>
                  </Col>
                </Row>
              </Card>

              {/* Location Recommendations */}
              <Card title={`Rekomendasi Lokasi untuk ${recommendations.business_type}`}>
                <List
                  dataSource={recommendations.recommendations}
                  renderItem={(item, index) => (
                    <List.Item>
                      <Card 
                        style={{ width: '100%' }}
                        size="small"
                        title={
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <span>
                              <EnvironmentOutlined style={{ marginRight: '8px' }} />
                              {item.area_name}, {item.city}
                            </span>
                            <Tag color={getScoreColor(item.compatibility_score)}>
                              {item.compatibility_score}% Match
                            </Tag>
                          </div>
                        }
                      >
                        <Row gutter={16}>
                          <Col span={12}>
                            <div style={{ marginBottom: '8px' }}>
                              <Tag color="blue">{item.area_type}</Tag>
                              <Tag color={getRentCostColor(item.rent_cost_category)}>
                                Sewa: {item.rent_cost_category}
                              </Tag>
                            </div>
                            
                            <div style={{ marginBottom: '8px' }}>
                              <strong>Target Market:</strong> {item.target_market}
                            </div>
                            
                            <div style={{ marginBottom: '8px' }}>
                              <TeamOutlined style={{ marginRight: '4px' }} />
                              <strong>Foot Traffic:</strong> {item.estimated_foot_traffic}
                            </div>
                            
                            <div>
                              <ShopOutlined style={{ marginRight: '4px' }} />
                              <strong>Kompetisi:</strong> {item.competition_level}
                            </div>
                          </Col>
                          
                          <Col span={12}>
                            <div>
                              <strong>Alasan Rekomendasi:</strong>
                              <ul style={{ marginTop: '8px', paddingLeft: '16px' }}>
                                {item.reasons.map((reason, reasonIndex) => (
                                  <li key={reasonIndex} style={{ fontSize: '13px' }}>{reason}</li>
                                ))}
                              </ul>
                            </div>
                          </Col>
                        </Row>
                      </Card>
                    </List.Item>
                  )}
                />
              </Card>
            </>
          )}

          {!recommendations && !loading && (
            <Card>
              <Alert
                message="Belum Ada Rekomendasi"
                description="Silakan isi form di sebelah kiri untuk mendapatkan rekomendasi lokasi bisnis yang sesuai dengan profil UMKM Anda."
                type="info"
                showIcon
              />
            </Card>
          )}
        </Col>
      </Row>
    </div>
  );
};

export default LocationRecommendation;