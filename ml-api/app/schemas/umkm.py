# ml-api/app/schemas/umkm.py
from pydantic import BaseModel
from typing import Dict, Any, Optional

class UMKMData(BaseModel):
    nama_usaha: str
    jenis_usaha: str
    tenaga_kerja_perempuan: int
    tenaga_kerja_laki_laki: int
    aset: float
    omset: float
    laba: float
    biaya_karyawan: float
    kapasitas_produksi: int
    jumlah_pelanggan: int
    tahun_berdiri: int
    marketplace: str
    status_legalitas: str
    kategori_umkm: Optional[str] = None

class HealthCheckResponse(BaseModel):
    umkm_id: str
    cluster: int
    health_score: float
    risk_level: str
    cluster_description: str
    umkm_data: Dict[str, Any]

class RecommendationResponse(BaseModel):
    umkm_id: str
    cluster_info: Dict[str, Any]
    recommendations: Dict[str, Any]
    generated_at: str