// backend/src/routes/umkm.js (ENHANCED MOCK DATA)
const express = require('express');
const router = express.Router();

// Enhanced mock data untuk demo yang lebih realistis
let mockUMKMs = [
  {
    _id: '1',
    nama_usaha: 'Warung Makan Bu Sari',
    jenis_usaha: 'Makanan & Minuman',
    tenaga_kerja_perempuan: 3,
    tenaga_kerja_laki_laki: 2,
    aset: 15000000,
    omset: 8000000,
    laba: 2000000,
    biaya_karyawan: 1500000,
    kapasitas_produksi: 100,
    jumlah_pelanggan: 150,
    tahun_berdiri: 2018,
    marketplace: 'Website Sendiri',
    status_legalitas: 'Terdaftar',
    kategori_umkm: 'Mikro',
    cluster: 0,
    health_score: 45,
    risk_level: 'tinggi',
    createdAt: new Date('2023-01-15'),
    updatedAt: new Date()
  },
  {
    _id: '2',
    nama_usaha: 'Toko Fashion Trendy',
    jenis_usaha: 'Fashion',
    tenaga_kerja_perempuan: 8,
    tenaga_kerja_laki_laki: 4,
    aset: 45000000,
    omset: 25000000,
    laba: 8000000,
    biaya_karyawan: 4000000,
    kapasitas_produksi: 800,
    jumlah_pelanggan: 1200,
    tahun_berdiri: 2015,
    marketplace: 'Shopee',
    status_legalitas: 'Terdaftar',
    kategori_umkm: 'Mikro',
    cluster: 1,
    health_score: 78,
    risk_level: 'rendah',
    createdAt: new Date('2023-02-20'),
    updatedAt: new Date()
  },
  {
    _id: '3',
    nama_usaha: 'Klinik Sehat Mandiri',
    jenis_usaha: 'Kesehatan',
    tenaga_kerja_perempuan: 6,
    tenaga_kerja_laki_laki: 3,
    aset: 75000000,
    omset: 35000000,
    laba: 12000000,
    biaya_karyawan: 8000000,
    kapasitas_produksi: 500,
    jumlah_pelanggan: 800,
    tahun_berdiri: 2017,
    marketplace: 'Website Sendiri',
    status_legalitas: 'Terdaftar',
    kategori_umkm: 'Kecil',
    cluster: 1,
    health_score: 82,
    risk_level: 'rendah',
    createdAt: new Date('2023-03-10'),
    updatedAt: new Date()
  },
  {
    _id: '4',
    nama_usaha: 'Bengkel Motor Jaya',
    jenis_usaha: 'Jasa',
    tenaga_kerja_perempuan: 1,
    tenaga_kerja_laki_laki: 5,
    aset: 25000000,
    omset: 12000000,
    laba: 4000000,
    biaya_karyawan: 3000000,
    kapasitas_produksi: 200,
    jumlah_pelanggan: 300,
    tahun_berdiri: 2019,
    marketplace: 'Website Sendiri',
    status_legalitas: 'Belum Terdaftar',
    kategori_umkm: 'Mikro',
    cluster: 0,
    health_score: 52,
    risk_level: 'sedang',
    createdAt: new Date('2023-04-05'),
    updatedAt: new Date()
  },
  {
    _id: '5',
    nama_usaha: 'Kursus Bahasa Inggris Smart',
    jenis_usaha: 'Pendidikan',
    tenaga_kerja_perempuan: 7,
    tenaga_kerja_laki_laki: 3,
    aset: 30000000,
    omset: 18000000,
    laba: 6000000,
    biaya_karyawan: 5000000,
    kapasitas_produksi: 400,
    jumlah_pelanggan: 600,
    tahun_berdiri: 2020,
    marketplace: 'Website Sendiri',
    status_legalitas: 'Terdaftar',
    kategori_umkm: 'Mikro',
    cluster: 0,
    health_score: 58,
    risk_level: 'sedang',
    createdAt: new Date('2023-05-12'),
    updatedAt: new Date()
  },
  {
    _id: '6',
    nama_usaha: 'Toko Elektronik Modern',
    jenis_usaha: 'Perdagangan',
    tenaga_kerja_perempuan: 4,
    tenaga_kerja_laki_laki: 6,
    aset: 65000000,
    omset: 45000000,
    laba: 15000000,
    biaya_karyawan: 6000000,
    kapasitas_produksi: 1000,
    jumlah_pelanggan: 1500,
    tahun_berdiri: 2016,
    marketplace: 'Tokopedia',
    status_legalitas: 'Terdaftar',
    kategori_umkm: 'Kecil',
    cluster: 1,
    health_score: 85,
    risk_level: 'rendah',
    createdAt: new Date('2023-06-08'),
    updatedAt: new Date()
  }
];

// Helper function untuk generate ID baru
const generateId = () => {
  return (mockUMKMs.length + 1).toString();
};

// Helper function untuk classify UMKM
const classifyUMKM = (aset, omset) => {
  const KRITERIA_MIKRO_ASET = 50000000;
  const KRITERIA_MIKRO_OMSET = 300000000;
  const KRITERIA_KECIL_ASET = 500000000;
  const KRITERIA_KECIL_OMSET = 2500000000;
  const KRITERIA_MENENGAH_ASET = 10000000000;
  const KRITERIA_MENENGAH_OMSET = 50000000000;

  if (aset <= KRITERIA_MIKRO_ASET || omset <= KRITERIA_MIKRO_OMSET) {
    return 'Mikro';
  } else if (aset <= KRITERIA_KECIL_ASET || omset <= KRITERIA_KECIL_OMSET) {
    return 'Kecil';
  } else if (aset <= KRITERIA_MENENGAH_ASET || omset <= KRITERIA_MENENGAH_OMSET) {
    return 'Menengah';
  } else {
    return 'Lainnya (Besar)';
  }
};

// Helper function untuk determine cluster
const determineCluster = (data) => {
  const capacity = data.kapasitas_produksi || 0;
  const customers = data.jumlah_pelanggan || 0;
  const omset = data.omset || 0;
  
  // Logic based pada analisis Kaggle
  // Cluster 1 (Low Risk): High capacity & customers
  // Cluster 0 (High Risk): Low capacity & customers
  
  const score = (capacity / 1000) + (customers / 1000) + (omset / 50000000);
  
  if (score > 1.5) {
    return {
      cluster: 1,
      health_score: Math.round(70 + (score * 5)), // 70-85 range
      risk_level: 'rendah'
    };
  } else {
    return {
      cluster: 0,
      health_score: Math.round(40 + (score * 10)), // 40-65 range
      risk_level: score > 0.8 ? 'sedang' : 'tinggi'
    };
  }
};

// GET all UMKM
router.get('/', (req, res) => {
  try {
    const { page = 1, limit = 10, search, cluster, risk_level, jenis_usaha } = req.query;
    
    let filtered = [...mockUMKMs];
    
    // Apply filters
    if (search) {
      const searchLower = search.toLowerCase();
      filtered = filtered.filter(umkm => 
        umkm.nama_usaha.toLowerCase().includes(searchLower) ||
        umkm.jenis_usaha.toLowerCase().includes(searchLower)
      );
    }
    
    if (cluster !== undefined && cluster !== '') {
      filtered = filtered.filter(umkm => umkm.cluster === parseInt(cluster));
    }
    
    if (risk_level) {
      filtered = filtered.filter(umkm => umkm.risk_level === risk_level);
    }
    
    if (jenis_usaha) {
      filtered = filtered.filter(umkm => umkm.jenis_usaha === jenis_usaha);
    }

    // Pagination
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + parseInt(limit);
    const paginatedData = filtered.slice(startIndex, endIndex);

    res.json({
      data: paginatedData,
      totalPages: Math.ceil(filtered.length / limit),
      currentPage: parseInt(page),
      total: filtered.length,
      totalFiltered: filtered.length
    });
  } catch (error) {
    res.status(500).json({
      message: 'Error fetching UMKM data',
      error: error.message
    });
  }
});

// GET UMKM by ID
router.get('/:id', (req, res) => {
  try {
    const umkm = mockUMKMs.find(u => u._id === req.params.id);
    
    if (!umkm) {
      return res.status(404).json({ message: 'UMKM not found' });
    }

    res.json({ data: umkm });
  } catch (error) {
    res.status(500).json({
      message: 'Error fetching UMKM',
      error: error.message
    });
  }
});

// POST create UMKM
router.post('/', (req, res) => {
  try {
    // Classify UMKM category
    const kategori_umkm = classifyUMKM(req.body.aset, req.body.omset);
    
    // Determine cluster and health metrics
    const clusterInfo = determineCluster(req.body);
    
    const newUMKM = {
      _id: generateId(),
      ...req.body,
      kategori_umkm,
      ...clusterInfo,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    mockUMKMs.push(newUMKM);

    res.status(201).json({
      message: 'UMKM created successfully',
      data: newUMKM
    });
  } catch (error) {
    res.status(400).json({
      message: 'Error creating UMKM',
      error: error.message
    });
  }
});

// PUT update UMKM
router.put('/:id', (req, res) => {
  try {
    const index = mockUMKMs.findIndex(u => u._id === req.params.id);
    
    if (index === -1) {
      return res.status(404).json({ message: 'UMKM not found' });
    }

    // Re-classify if financial data changed
    const kategori_umkm = classifyUMKM(req.body.aset, req.body.omset);
    const clusterInfo = determineCluster(req.body);

    mockUMKMs[index] = {
      ...mockUMKMs[index],
      ...req.body,
      kategori_umkm,
      ...clusterInfo,
      updatedAt: new Date()
    };

    res.json({
      message: 'UMKM updated successfully',
      data: mockUMKMs[index]
    });
  } catch (error) {
    res.status(400).json({
      message: 'Error updating UMKM',
      error: error.message
    });
  }
});

// DELETE UMKM
router.delete('/:id', (req, res) => {
  try {
    const index = mockUMKMs.findIndex(u => u._id === req.params.id);
    
    if (index === -1) {
      return res.status(404).json({ message: 'UMKM not found' });
    }

    const deletedUMKM = mockUMKMs.splice(index, 1)[0];

    res.json({ 
      message: 'UMKM deleted successfully',
      data: deletedUMKM
    });
  } catch (error) {
    res.status(500).json({
      message: 'Error deleting UMKM',
      error: error.message
    });
  }
});

// GET dashboard stats
router.get('/dashboard-stats', (req, res) => {
  try {
    const totalUMKM = mockUMKMs.length;
    
    // Cluster statistics
    const cluster0Count = mockUMKMs.filter(u => u.cluster === 0).length;
    const cluster1Count = mockUMKMs.filter(u => u.cluster === 1).length;
    
    const cluster0AvgHealth = cluster0Count > 0 ? 
      mockUMKMs.filter(u => u.cluster === 0).reduce((sum, u) => sum + u.health_score, 0) / cluster0Count : 0;
    const cluster1AvgHealth = cluster1Count > 0 ?
      mockUMKMs.filter(u => u.cluster === 1).reduce((sum, u) => sum + u.health_score, 0) / cluster1Count : 0;

    const clusterStats = [
      { _id: 0, count: cluster0Count, avgHealthScore: cluster0AvgHealth },
      { _id: 1, count: cluster1Count, avgHealthScore: cluster1AvgHealth }
    ];

    // Risk level statistics
    const riskCounts = mockUMKMs.reduce((acc, umkm) => {
      acc[umkm.risk_level] = (acc[umkm.risk_level] || 0) + 1;
      return acc;
    }, {});

    const riskLevelStats = Object.entries(riskCounts).map(([level, count]) => ({
      _id: level,
      count
    }));

    // Business type statistics
    const businessTypeCounts = mockUMKMs.reduce((acc, umkm) => {
      const type = umkm.jenis_usaha;
      if (!acc[type]) {
        acc[type] = { count: 0, totalOmset: 0 };
      }
      acc[type].count++;
      acc[type].totalOmset += umkm.omset;
      return acc;
    }, {});

    const jenisUsahaStats = Object.entries(businessTypeCounts)
      .map(([type, data]) => ({
        _id: type,
        count: data.count,
        avgOmset: data.totalOmset / data.count
      }))
      .sort((a, b) => b.count - a.count);

    res.json({
      totalUMKM,
      clusterStats,
      riskLevelStats,
      jenisUsahaStats,
      healthScoreAverage: mockUMKMs.reduce((sum, u) => sum + u.health_score, 0) / totalUMKM,
      generatedAt: new Date()
    });
  } catch (error) {
    res.status(500).json({
      message: 'Error fetching dashboard stats',
      error: error.message
    });
  }
});

module.exports = router;