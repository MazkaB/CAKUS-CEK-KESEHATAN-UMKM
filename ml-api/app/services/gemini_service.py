# ml-api/app/services/gemini_service.py
import google.generativeai as genai
from typing import Dict, Any, List
from app.core.config import settings

class GeminiService:
    def __init__(self):
        if settings.GEMINI_API_KEY:
            genai.configure(api_key=settings.GEMINI_API_KEY)
            self.model = genai.GenerativeModel('gemini-pro')
        else:
            self.model = None
    
    def generate_umkm_recommendations(self, umkm_data: Dict[str, Any], cluster_info: Dict[str, Any]) -> Dict[str, Any]:
        """Generate business recommendations for UMKM using Gemini AI"""
        if not self.model:
            return self._fallback_recommendations(umkm_data, cluster_info)
        
        # Prepare context for Gemini
        context = f"""
        Berikan rekomendasi bisnis untuk UMKM dengan data berikut:
        
        Informasi Usaha:
        - Nama: {umkm_data.get('nama_usaha', 'N/A')}
        - Jenis Usaha: {umkm_data.get('jenis_usaha', 'N/A')}
        - Tahun Berdiri: {umkm_data.get('tahun_berdiri', 'N/A')}
        - Status Legalitas: {umkm_data.get('status_legalitas', 'N/A')}
        
        Kondisi Keuangan:
        - Aset: Rp {umkm_data.get('aset', 0):,}
        - Omset: Rp {umkm_data.get('omset', 0):,}
        - Laba: Rp {umkm_data.get('laba', 0):,}
        - Biaya Karyawan: Rp {umkm_data.get('biaya_karyawan', 0):,}
        
        Operasional:
        - Kapasitas Produksi: {umkm_data.get('kapasitas_produksi', 0)} unit
        - Jumlah Pelanggan: {umkm_data.get('jumlah_pelanggan', 0)}
        - Tenaga Kerja: {umkm_data.get('tenaga_kerja_perempuan', 0)} perempuan, {umkm_data.get('tenaga_kerja_laki_laki', 0)} laki-laki
        - Marketplace: {umkm_data.get('marketplace', 'N/A')}
        
        Analisis Cluster:
        - Cluster: {cluster_info.get('cluster', 'N/A')}
        - Risk Level: {cluster_info.get('risk_level', 'N/A')}
        - Health Score: {cluster_info.get('health_score', 0)}/100
        
        Berikan rekomendasi dalam kategori berikut:
        1. Strategi Keuangan (3-4 poin spesifik)
        2. Operasional & Produksi (3-4 poin spesifik)
        3. Pemasaran & Penjualan (3-4 poin spesifik)
        4. Manajemen Risiko (3-4 poin spesifik)
        5. Pengembangan Jangka Panjang (3-4 poin spesifik)
        
        Format dalam JSON dengan struktur:
        {
            "strategi_keuangan": ["poin1", "poin2", ...],
            "operasional_produksi": ["poin1", "poin2", ...],
            "pemasaran_penjualan": ["poin1", "poin2", ...],
            "manajemen_risiko": ["poin1", "poin2", ...],
            "pengembangan_jangka_panjang": ["poin1", "poin2", ...]
        }
        """
        
        try:
            response = self.model.generate_content(context)
            # Parse the response (assuming it returns structured JSON)
            recommendations = self._parse_gemini_response(response.text)
            return recommendations
        except Exception as e:
            print(f"Gemini API error: {e}")
            return self._fallback_recommendations(umkm_data, cluster_info)
    
    def _parse_gemini_response(self, response_text: str) -> Dict[str, List[str]]:
        """Parse Gemini response and extract recommendations"""
        try:
            # Try to extract JSON from response
            import json
            import re
            
            # Find JSON pattern in response
            json_match = re.search(r'\{.*\}', response_text, re.DOTALL)
            if json_match:
                return json.loads(json_match.group())
            else:
                # Parse manually if JSON format not found
                return self._manual_parse_response(response_text)
        except:
            return self._default_recommendations()
    
    def _manual_parse_response(self, response_text: str) -> Dict[str, List[str]]:
        """Manually parse response if JSON parsing fails"""
        recommendations = {
            "strategi_keuangan": [],
            "operasional_produksi": [],
            "pemasaran_penjualan": [],
            "manajemen_risiko": [],
            "pengembangan_jangka_panjang": []
        }
        
        # Simple parsing logic (can be improved)
        lines = response_text.split('\n')
        current_category = None
        
        for line in lines:
            line = line.strip()
            if 'keuangan' in line.lower():
                current_category = 'strategi_keuangan'
            elif 'operasional' in line.lower() or 'produksi' in line.lower():
                current_category = 'operasional_produksi'
            elif 'pemasaran' in line.lower() or 'penjualan' in line.lower():
                current_category = 'pemasaran_penjualan'
            elif 'risiko' in line.lower():
                current_category = 'manajemen_risiko'
            elif 'pengembangan' in line.lower() or 'jangka panjang' in line.lower():
                current_category = 'pengembangan_jangka_panjang'
            elif line.startswith('-') or line.startswith('•') and current_category:
                recommendations[current_category].append(line[1:].strip())
        
        return recommendations
    
    def _fallback_recommendations(self, umkm_data: Dict[str, Any], cluster_info: Dict[str, Any]) -> Dict[str, List[str]]:
        """Generate fallback recommendations when Gemini is not available"""
        risk_level = cluster_info.get('risk_level', 'sedang')
        cluster = cluster_info.get('cluster', 0)
        
        if cluster == 1:  # Low risk cluster
            return {
                "strategi_keuangan": [
                    "Manfaatkan posisi keuangan yang stabil untuk ekspansi bisnis",
                    "Diversifikasi sumber pendapatan untuk mengurangi risiko",
                    "Pertimbangkan investasi dalam teknologi untuk efisiensi operasional",
                    "Bangun dana darurat minimal 6 bulan biaya operasional"
                ],
                "operasional_produksi": [
                    "Optimimalkan kapasitas produksi yang sudah tinggi",
                    "Implementasikan sistem quality control yang lebih baik",
                    "Pertimbangkan otomasi proses untuk meningkatkan efisiensi",
                    "Lakukan pelatihan rutin untuk meningkatkan produktivitas karyawan"
                ],
                "pemasaran_penjualan": [
                    "Perluas jangkauan pasar melalui platform digital",
                    "Kembangkan program loyalitas pelanggan",
                    "Tingkatkan strategi branding dan positioning produk",
                    "Explore partnership dengan bisnis komplementer"
                ],
                "manajemen_risiko": [
                    "Lakukan assessment risiko operasional secara berkala",
                    "Pertimbangkan asuransi bisnis untuk proteksi aset",
                    "Diversifikasi supplier untuk mengurangi risiko supply chain",
                    "Monitor cash flow secara real-time"
                ],
                "pengembangan_jangka_panjang": [
                    "Rencanakan ekspansi ke pasar baru",
                    "Investasi dalam R&D untuk inovasi produk",
                    "Kembangkan second line of business",
                    "Pertimbangkan franchise atau licensing model"
                ]
            }
        else:  # High risk cluster
            return {
                "strategi_keuangan": [
                    "Fokus pada cash flow management yang ketat",
                    "Kurangi biaya operasional yang tidak esensial",
                    "Cari sumber pendanaan dengan bunga rendah",
                    "Improve collection process untuk mempercepat receivables"
                ],
                "operasional_produksi": [
                    "Tingkatkan kapasitas produksi secara bertahap",
                    "Fokus pada efisiensi proses produksi",
                    "Optimimalkan utilisasi tenaga kerja existing",
                    "Implementasikan lean manufacturing principles"
                ],
                "pemasaran_penjualan": [
                    "Fokus pada customer retention daripada acquisition",
                    "Tingkatkan conversion rate dari prospek existing",
                    "Optimalkan penggunaan digital marketing dengan budget terbatas",
                    "Kembangkan referral program untuk organic growth"
                ],
                "manajemen_risiko": [
                    "Lakukan stress testing untuk skenario worst case",
                    "Buat contingency plan untuk berbagai risiko bisnis",
                    "Monitor kompetitor secara intensif",
                    "Maintain relationship yang baik dengan stakeholders kunci"
                ],
                "pengembangan_jangka_panjang": [
                    "Fokus pada core business strengthening terlebih dahulu",
                    "Kembangkan competitive advantage yang sustainable",
                    "Investasi dalam skill development tim",
                    "Build strong brand reputation di niche market"
                ]
            }
    
    def _default_recommendations(self) -> Dict[str, List[str]]:
        """Default recommendations when all parsing fails"""
        return {
            "strategi_keuangan": [
                "Lakukan review keuangan rutin setiap bulan",
                "Pisahkan keuangan pribadi dan bisnis",
                "Buat proyeksi cash flow 6 bulan ke depan"
            ],
            "operasional_produksi": [
                "Tingkatkan efisiensi proses kerja",
                "Lakukan maintenance rutin equipment",
                "Train karyawan untuk multiskilling"
            ],
            "pemasaran_penjualan": [
                "Maksimalkan penggunaan media sosial",
                "Fokus pada customer satisfaction",
                "Develop unique selling proposition"
            ],
            "manajemen_risiko": [
                "Buat backup plan untuk operasional",
                "Diversifikasi customer base",
                "Monitor market trend secara berkala"
            ],
            "pengembangan_jangka_panjang": [
                "Set target pertumbuhan yang realistis",
                "Investasi dalam teknologi",
                "Build network dengan sesama entrepreneur"
            ]
        }

# Initialize global service
gemini_service = GeminiService()