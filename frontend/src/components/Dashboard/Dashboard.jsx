// frontend/src/components/Dashboard/Dashboard.jsx (UPDATED WITH BETTER ERROR HANDLING)
import React, { useState, useEffect } from 'react';
import { Card, Row, Col, Statistic, Table, Button, Select, Input, message, Spin } from 'antd';
import { 
  UserOutlined, 
  ShopOutlined, 
  TrophyOutlined, 
  WarningOutlined,
  EyeOutlined,
  EditOutlined,
  DeleteOutlined,
  PlusOutlined,
  ReloadOutlined
} from '@ant-design/icons';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell } from 'recharts';
import { useNavigate } from 'react-router-dom';
import { umkmService } from '../../services/umkmService';
import './Dashboard.css';

const { Option } = Select;
const { Search } = Input;

const Dashboard = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [dashboardStats, setDashboardStats] = useState({});
  const [umkmList, setUMKMList] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const [filters, setFilters] = useState({
    search: '',
    cluster: '',
    risk_level: '',
    jenis_usaha: ''
  });

  useEffect(() => {
    fetchAllData();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [umkmList, filters]);

  const fetchAllData = async () => {
    setLoading(true);
    try {
      await Promise.all([
        fetchDashboardData(),
        fetchUMKMList()
      ]);
    } catch (error) {
      message.error('Gagal memuat data dashboard');
    } finally {
      setLoading(false);
    }
  };

  const fetchDashboardData = async () => {
    try {
      const response = await umkmService.getDashboardStats();
      setDashboardStats(response.data);
    } catch (error) {
      console.error('Dashboard stats error:', error);
      // Set default stats if API fails
      setDashboardStats({
        totalUMKM: 0,
        clusterStats: [],
        riskLevelStats: [],
        jenisUsahaStats: []
      });
    }
  };

  const fetchUMKMList = async () => {
    try {
      const response = await umkmService.getAllUMKM({ limit: 50 });
      setUMKMList(response.data.data || []);
    } catch (error) {
      console.error('UMKM list error:', error);
      setUMKMList([]);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    try {
      await fetchAllData();
      message.success('Data berhasil diperbarui');
    } catch (error) {
      message.error('Gagal memperbarui data');
    } finally {
      setRefreshing(false);
    }
  };

  const applyFilters = () => {
    let filtered = [...umkmList];

    if (filters.search) {
      filtered = filtered.filter(umkm => 
        umkm.nama_usaha?.toLowerCase().includes(filters.search.toLowerCase()) ||
        umkm.jenis_usaha?.toLowerCase().includes(filters.search.toLowerCase())
      );
    }

    if (filters.cluster !== '') {
      filtered = filtered.filter(umkm => umkm.cluster === parseInt(filters.cluster));
    }

    if (filters.risk_level) {
      filtered = filtered.filter(umkm => umkm.risk_level === filters.risk_level);
    }

    if (filters.jenis_usaha) {
      filtered = filtered.filter(umkm => umkm.jenis_usaha === filters.jenis_usaha);
    }

    setFilteredData(filtered);
  };

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const handleDeleteUMKM = async (id) => {
    try {
      await umkmService.deleteUMKM(id);
      message.success('UMKM berhasil dihapus');
      fetchAllData();
    } catch (error) {
      message.error('Gagal menghapus UMKM');
    }
  };

  // Prepare chart data with error handling
  const clusterChartData = dashboardStats.clusterStats?.map(stat => ({
    name: `Cluster ${stat._id}`,
    value: stat.count || 0,
    healthScore: stat.avgHealthScore?.toFixed(1) || 0
  })) || [];

  const riskLevelData = dashboardStats.riskLevelStats?.map(stat => ({
    name: stat._id || 'Unknown',
    value: stat.count || 0
  })) || [];

  const jenisUsahaData = dashboardStats.jenisUsahaStats?.slice(0, 6).map(stat => ({
    name: stat._id || 'Unknown',
    count: stat.count || 0,
    avgOmset: (stat.avgOmset || 0) / 1000000 // Convert to millions
  })) || [];

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#82CA9D'];

  const columns = [
    {
      title: 'Nama Usaha',
      dataIndex: 'nama_usaha',
      key: 'nama_usaha',
      sorter: (a, b) => (a.nama_usaha || '').localeCompare(b.nama_usaha || ''),
      render: (text, record) => (
        <div>
          <div style={{ fontWeight: 'bold' }}>{text || 'N/A'}</div>
          <div style={{ fontSize: '12px', color: '#666' }}>{record.jenis_usaha || 'N/A'}</div>
        </div>
      )
    },
    {
      title: 'Cluster',
      dataIndex: 'cluster',
      key: 'cluster',
      render: (cluster) => (
        <span style={{ 
          padding: '4px 8px', 
          borderRadius: '4px',
          background: cluster === 1 ? '#f6ffed' : '#fff2e8',
          color: cluster === 1 ? '#52c41a' : '#fa8c16'
        }}>
          Cluster {cluster}
        </span>
      ),
      sorter: (a, b) => (a.cluster || 0) - (b.cluster || 0),
    },
    {
      title: 'Health Score',
      dataIndex: 'health_score',
      key: 'health_score',
      render: (score) => score ? `${score}/100` : 'N/A',
      sorter: (a, b) => (a.health_score || 0) - (b.health_score || 0)
    },
    {
      title: 'Risk Level',
      dataIndex: 'risk_level',
      key: 'risk_level',
      render: (risk) => {
        const colors = {
          'rendah': '#52c41a',
          'sedang': '#faad14',
          'tinggi': '#f5222d'
        };
        return (
          <span style={{ color: colors[risk] || '#666' }}>
            {risk?.toUpperCase() || 'N/A'}
          </span>
        );
      },
    },
    {
      title: 'Omset',
      dataIndex: 'omset',
      key: 'omset',
      render: (omset) => `Rp ${(omset || 0).toLocaleString()}`,
      sorter: (a, b) => (a.omset || 0) - (b.omset || 0)
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record) => (
        <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap' }}>
          <Button
            type="primary"
            size="small"
            icon={<EyeOutlined />}
            onClick={() => navigate(`/health-check/${record._id}`)}
          >
            Cek
          </Button>
          <Button
            size="small"
            icon={<EditOutlined />}
            onClick={() => navigate(`/edit-umkm/${record._id}`)}
          >
            Edit
          </Button>
          <Button
            danger
            size="small"
            icon={<DeleteOutlined />}
            onClick={() => handleDeleteUMKM(record._id)}
          >
            Hapus
          </Button>
        </div>
      )
    }
  ];

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '50px' }}>
        <Spin size="large" />
        <p style={{ marginTop: '16px' }}>Memuat dashboard...</p>
      </div>
    );
  }

  return (
    <div className="dashboard">
      {/* Header Stats */}
      <Row gutter={16} style={{ marginBottom: '24px' }}>
        <Col span={6}>
          <Card>
            <Statistic
              title="Total UMKM"
              value={dashboardStats.totalUMKM || 0}
              prefix={<ShopOutlined />}
              valueStyle={{ color: '#1890ff' }}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="Cluster 1 (Low Risk)"
              value={clusterChartData.find(d => d.name === 'Cluster 1')?.value || 0}
              prefix={<TrophyOutlined />}
              valueStyle={{ color: '#52c41a' }}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="Cluster 0 (High Risk)"
              value={clusterChartData.find(d => d.name === 'Cluster 0')?.value || 0}
              prefix={<WarningOutlined />}
              valueStyle={{ color: '#fa8c16' }}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="Avg Health Score"
              value={dashboardStats.healthScoreAverage || 0}
              precision={1}
              suffix="/100"
              prefix={<UserOutlined />}
              valueStyle={{ color: '#722ed1' }}
            />
          </Card>
        </Col>
      </Row>

      {/* Charts */}
      <Row gutter={16} style={{ marginBottom: '24px' }}>
        <Col span={12}>
          <Card title="Distribusi Cluster">
            {clusterChartData.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={clusterChartData}
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                    label={({ name, value }) => `${name}: ${value}`}
                  >
                    {clusterChartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div style={{ textAlign: 'center', padding: '50px', color: '#999' }}>
                Tidak ada data untuk ditampilkan
              </div>
            )}
          </Card>
        </Col>
        <Col span={12}>
          <Card title="Jenis Usaha">
            {jenisUsahaData.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={jenisUsahaData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" angle={-45} textAnchor="end" height={80} />
                  <YAxis />
                  <Tooltip formatter={(value) => [value, 'Jumlah UMKM']} />
                  <Bar dataKey="count" fill="#8884d8" />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div style={{ textAlign: 'center', padding: '50px', color: '#999' }}>
                Tidak ada data untuk ditampilkan
              </div>
            )}
          </Card>
        </Col>
      </Row>

      {/* UMKM List */}
      <Card 
        title="Daftar UMKM"
        extra={
          <div style={{ display: 'flex', gap: '8px' }}>
            <Button 
              icon={<ReloadOutlined />}
              onClick={handleRefresh}
              loading={refreshing}
            >
              Refresh
            </Button>
            <Button 
              type="primary" 
              icon={<PlusOutlined />}
              onClick={() => navigate('/register-umkm')}
            >
              Tambah UMKM
            </Button>
          </div>
        }
      >
        {/* Filters */}
        <Row gutter={16} style={{ marginBottom: '16px' }}>
          <Col span={8}>
            <Search
              placeholder="Cari nama usaha atau jenis usaha"
              allowClear
              onChange={(e) => handleFilterChange('search', e.target.value)}
              style={{ width: '100%' }}
            />
          </Col>
          <Col span={4}>
            <Select
              placeholder="Filter Cluster"
              allowClear
              style={{ width: '100%' }}
              onChange={(value) => handleFilterChange('cluster', value)}
            >
              <Option value="0">Cluster 0</Option>
              <Option value="1">Cluster 1</Option>
            </Select>
          </Col>
          <Col span={4}>
            <Select
              placeholder="Filter Risk Level"
              allowClear
              style={{ width: '100%' }}
              onChange={(value) => handleFilterChange('risk_level', value)}
            >
              <Option value="rendah">Rendah</Option>
              <Option value="sedang">Sedang</Option>
              <Option value="tinggi">Tinggi</Option>
            </Select>
          </Col>
          <Col span={8}>
            <Select
              placeholder="Filter Jenis Usaha"
              allowClear
              style={{ width: '100%' }}
              onChange={(value) => handleFilterChange('jenis_usaha', value)}
            >
              <Option value="Fashion">Fashion</Option>
              <Option value="Jasa">Jasa</Option>
              <Option value="Kesehatan">Kesehatan</Option>
              <Option value="Makanan & Minuman">Makanan & Minuman</Option>
              <Option value="Pendidikan">Pendidikan</Option>
              <Option value="Perdagangan">Perdagangan</Option>
              <Option value="Perusahaan">Perusahaan</Option>
            </Select>
          </Col>
        </Row>

        <Table
          columns={columns}
          dataSource={filteredData}
          rowKey="_id"
          loading={loading}
          pagination={{
            pageSize: 10,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total, range) => 
              `${range[0]}-${range[1]} dari ${total} UMKM`,
          }}
          scroll={{ x: 1200 }}
        />
      </Card>
    </div>
  );
};

export default Dashboard;