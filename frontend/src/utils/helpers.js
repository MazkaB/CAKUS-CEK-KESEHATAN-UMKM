// frontend/src/utils/helpers.js
export const formatCurrency = (amount) => {
  if (!amount) return 'Rp 0';
  return `Rp ${amount.toLocaleString('id-ID')}`;
};

export const formatNumber = (number) => {
  if (!number) return '0';
  return number.toLocaleString('id-ID');
};

export const getClusterColor = (cluster) => {
  return cluster === 1 ? '#52c41a' : '#fa8c16';
};

export const getRiskLevelColor = (riskLevel) => {
  const colors = {
    'rendah': '#52c41a',
    'sedang': '#faad14', 
    'tinggi': '#f5222d'
  };
  return colors[riskLevel] || '#1890ff';
};

export const calculateAge = (yearFounded) => {
  return new Date().getFullYear() - yearFounded;
};

export const calculateProfitMargin = (profit, revenue) => {
  if (!revenue || revenue === 0) return 0;
  return ((profit / revenue) * 100).toFixed(1);
};

export const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const validatePhone = (phone) => {
  const phoneRegex = /^(\+62|62|0)8[1-9][0-9]{6,9}$/;
  return phoneRegex.test(phone);
};

export const truncateText = (text, maxLength = 100) => {
  if (!text) return '';
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + '...';
};

export const debounce = (func, wait) => {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};

export const downloadFile = (data, filename, type = 'text/csv') => {
  const blob = new Blob([data], { type });
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.setAttribute('download', filename);
  document.body.appendChild(link);
  link.click();
  link.remove();
  window.URL.revokeObjectURL(url);
};

export const generateUniqueId = () => {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
};

export const classifyUMKM = (aset, omset) => {
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