// frontend/src/utils/constants.js
export const BUSINESS_TYPES = [
  'Fashion',
  'Jasa', 
  'Kesehatan',
  'Makanan & Minuman',
  'Pendidikan',
  'Perdagangan',
  'Perusahaan'
];

export const MARKETPLACE_OPTIONS = [
  'Website Sendiri',
  'Bukalapak',
  'Lazada', 
  'Tokopedia',
  'Shopee'
];

export const LEGAL_STATUS_OPTIONS = [
  'Terdaftar',
  'Belum Terdaftar'
];

export const UMKM_CATEGORIES = [
  'Mikro',
  'Kecil', 
  'Menengah',
  'Lainnya (Besar)'
];

export const RISK_LEVELS = [
  { value: 'rendah', label: 'Rendah', color: '#52c41a' },
  { value: 'sedang', label: 'Sedang', color: '#faad14' },
  { value: 'tinggi', label: 'Tinggi', color: '#f5222d' }
];

export const CLUSTER_INFO = {
  0: {
    name: 'Cluster 0',
    description: 'Perlu Perbaikan',
    riskLevel: 'tinggi',
    color: '#fa8c16'
  },
  1: {
    name: 'Cluster 1', 
    description: 'Performa Baik',
    riskLevel: 'rendah',
    color: '#52c41a'
  }
};

export const API_ENDPOINTS = {
  UMKM: '/umkm',
  HEALTH_CHECK: '/health-check',
  RECOMMENDATIONS: '/recommendations',
  LOCATIONS: '/location-recommendations'
};