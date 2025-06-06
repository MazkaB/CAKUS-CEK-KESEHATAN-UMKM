// frontend/src/services/mlService.js (UPDATED WITH BETTER MOCK DATA)
import axios from 'axios';

const ML_API_URL = process.env.REACT_APP_ML_API_URL || 'http://localhost:8000';

const mlApi = axios.create({
  baseURL: ML_API_URL,
  timeout: 30000,
});

// Mock data untuk demo yang lebih realistis
const generateMockHealthData = (umkmId) => {
  const randomCluster = Math.random() > 0.5 ? 1 : 0;
  const healthScore = randomCluster === 1 ? 
    Math.round(70 + Math.random() * 15) : // 70-85 untuk cluster 1
    Math.round(40 + Math.random() * 25); // 40-65 untuk cluster 0
  
  const riskLevel = randomCluster === 1 ? 'rendah' : 
    (healthScore > 55 ? 'sedang' : 'tinggi');

  return {
    umkm_id: umkmId,
    cluster: randomCluster,
    health_score: healthScore,
    risk_level: riskLevel,
    cluster_description: randomCluster === 1 ? 'Performa Baik' : 'Perlu Perbaikan',
    umkm_data: {
      aset: Math.round(Math.random() * 50000000 + 10000000),
      omset: Math.round(Math.random() * 30000000 + 5000000),
      laba: Math.round(Math.random() * 10000000 + 1000000),
      biaya_karyawan: Math.round(Math.random() * 5000000 + 1000000),
      kapasitas_produksi: randomCluster === 1 ? 
        Math.round(Math.random() * 500 + 400) : 
        Math.round(Math.random() * 300 + 50),
      jumlah_pelanggan: randomCluster === 1 ? 
        Math.round(Math.random() * 800 + 400) : 
        Math.round(Math.random() * 300 + 50),
      tenaga_kerja_perempuan: Math.round(Math.random() * 5 + 2),
      tenaga_kerja_laki_laki: Math.round(Math.random() * 5 + 2),
      tahun_berdiri: Math.round(Math.random() * 10 + 2015)
    }
  };
};

const generateMockRecommendations = (umkmId) => {
  const cluster = Math.random() > 0.5 ? 1 : 0;
  const healthScore = cluster === 1 ? 75 : 45;
  const riskLevel = cluster === 1 ? 'rendah' : 'tinggi';

  const recommendations = cluster === 1 ? {
    // Rekomendasi untuk cluster 1 (low risk)
    strategi_keuangan: [
      "Manfaatkan posisi keuangan yang stabil untuk ekspansi bisnis",
      "Diversifikasi sumber pendapatan untuk mengurangi risiko",
      "Pertimbangkan investasi dalam teknologi untuk efisiensi operasional",
      "Bangun dana darurat minimal 6 bulan biaya operasional"
    ],
    operasional_produksi: [
      "Optimimalkan kapasitas produksi yang sudah tinggi",
      "Implementasikan sistem quality control yang lebih baik",
      "Pertimbangkan otomasi proses untuk meningkatkan efisiensi",
      "Lakukan pelatihan rutin untuk meningkatkan produktivitas karyawan"
    ],
    pemasaran_penjualan: [
      "Perluas jangkauan pasar melalui platform digital",
      "Kembangkan program loyalitas pelanggan",
      "Tingkatkan strategi branding dan positioning produk",
      "Explore partnership dengan bisnis komplementer"
    ],
    manajemen_risiko: [
      "Lakukan assessment risiko operasional secara berkala",
      "Pertimbangkan asuransi bisnis untuk proteksi aset",
      "Diversifikasi supplier untuk mengurangi risiko supply chain",
      "Monitor cash flow secara real-time"
    ],
    pengembangan_jangka_panjang: [
      "Rencanakan ekspansi ke pasar baru",
      "Investasi dalam R&D untuk inovasi produk",
      "Kembangkan second line of business",
      "Pertimbangkan franchise atau licensing model"
    ]
  } : {
    // Rekomendasi untuk cluster 0 (high risk)
    strategi_keuangan: [
      "Fokus pada cash flow management yang ketat",
      "Kurangi biaya operasional yang tidak esensial",
      "Cari sumber pendanaan dengan bunga rendah",
      "Improve collection process untuk mempercepat receivables"
    ],
    operasional_produksi: [
      "Tingkatkan kapasitas produksi secara bertahap",
      "Fokus pada efisiensi proses produksi",
      "Optimimalkan utilisasi tenaga kerja existing",
      "Implementasikan lean manufacturing principles"
    ],
    pemasaran_penjualan: [
      "Fokus pada customer retention daripada acquisition",
      "Tingkatkan conversion rate dari prospek existing",
      "Optimalkan penggunaan digital marketing dengan budget terbatas",
      "Kembangkan referral program untuk organic growth"
    ],
    manajemen_risiko: [
      "Lakukan stress testing untuk skenario worst case",
      "Buat contingency plan untuk berbagai risiko bisnis",
      "Monitor kompetitor secara intensif",
      "Maintain relationship yang baik dengan stakeholders kunci"
    ],
    pengembangan_jangka_panjang: [
      "Fokus pada core business strengthening terlebih dahulu",
      "Kembangkan competitive advantage yang sustainable",
      "Investasi dalam skill development tim",
      "Build strong brand reputation di niche market"
    ]
  };

  return {
    umkm_id: umkmId,
    cluster_info: {
      cluster,
      health_score: healthScore,
      risk_level: riskLevel
    },
    recommendations
  };
};

export const mlService = {
  checkHealth: (umkmId) => {
    // Simulasi delay API
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({ data: generateMockHealthData(umkmId) });
      }, 1500);
    });
  },
  
  getRecommendations: (umkmId) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({ data: generateMockRecommendations(umkmId) });
      }, 2000);
    });
  },
  
  getLocationRecommendations: (data) => {
    const jenisUsaha = data.jenis_usaha;
    const aset = data.aset || 0;
    
    // Generate mock location recommendations based on business type
    const recommendations = [
      {
        city: "Jakarta",
        area_name: jenisUsaha === "Fashion" ? "Kemang" : "Menteng",
        area_type: jenisUsaha === "Fashion" ? "Trendy" : "Premium",
        rent_cost_category: aset > 30000000 ? "Tinggi" : "Sedang",
        compatibility_score: Math.round(75 + Math.random() * 15),
        reasons: [
          `Cocok untuk jenis usaha ${jenisUsaha}`,
          "Area komersial dengan traffic tinggi",
          "Akses transportasi yang mudah"
        ],
        estimated_foot_traffic: "Tinggi",
        target_market: jenisUsaha === "Fashion" ? "Anak muda, trendsetter" : "Kalangan menengah atas",
        competition_level: "Sedang"
      },
      {
        city: "Bandung",
        area_name: "Dago",
        area_type: "Trendy",
        rent_cost_category: "Sedang",
        compatibility_score: Math.round(70 + Math.random() * 10),
        reasons: [
          "Biaya operasional lebih terjangkau",
          "Komunitas bisnis yang mendukung",
          "Target market yang sesuai"
        ],
        estimated_foot_traffic: "Sedang-Tinggi",
        target_market: "Local residents, wisatawan",
        competition_level: "Sedang"
      },
      {
        city: "Surabaya",
        area_name: "Gubeng",
        area_type: "Commercial",
        rent_cost_category: "Sedang",
        compatibility_score: Math.round(65 + Math.random() * 15),
        reasons: [
          "Pusat bisnis di Jawa Timur",
          "Infrastruktur yang memadai",
          "Potensi pasar yang besar"
        ],
        estimated_foot_traffic: "Tinggi",
        target_market: "Profesional, pebisnis",
        competition_level: "Sedang-Tinggi"
      }
    ];

    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          data: {
            data: {
              recommendations: recommendations.sort((a, b) => b.compatibility_score - a.compatibility_score),
              market_analysis: {
                market_trends: [
                  "Digital transformation",
                  "Sustainable business practices",
                  "Local brand preference",
                  "E-commerce integration"
                ],
                key_challenges: [
                  "Intense competition",
                  "Rising operational costs", 
                  "Customer acquisition costs",
                  "Regulatory compliance"
                ],
                business_opportunities: [
                  "Online marketplace expansion",
                  "Strategic partnerships",
                  "Technology adoption",
                  "Market diversification"
                ],
                budget_recommendations: [
                  "Pilih lokasi dengan ROI yang optimal",
                  "Pertimbangkan sharing space untuk efisiensi biaya",
                  "Investasi bertahap dalam infrastruktur"
                ],
                market_size_indicator: "Growing"
              },
              business_type: jenisUsaha,
              budget_category: aset > 40000000 ? "Tinggi" : (aset > 20000000 ? "Sedang" : "Rendah")
            }
          }
        });
      }, 1800);
    });
  }
};
