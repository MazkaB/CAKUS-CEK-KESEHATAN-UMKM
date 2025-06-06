from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import random

app = FastAPI(
    title="CAKUS ML API",
    description="Machine Learning API for UMKM Health Check",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
async def root():
    return {"message": "CAKUS ML API is running", "version": "1.0.0"}

@app.get("/health")
async def health():
    return {"status": "healthy"}

@app.post("/health-check")
async def check_health(request: dict):
    # Simple mock clustering logic
    umkm_data = request.get("umkm_data", {})
    
    # Simple logic: if capacity > 400, assign to cluster 1 (low risk)
    capacity = umkm_data.get("kapasitas_produksi", 0)
    customers = umkm_data.get("jumlah_pelanggan", 0)
    
    if capacity > 400 and customers > 400:
        cluster = 1
        health_score = 75
        risk_level = "rendah"
        description = "Performa Baik"
    else:
        cluster = 0
        health_score = 45
        risk_level = "tinggi"
        description = "Perlu Perbaikan"
    
    return {
        "umkm_id": request.get("umkm_id"),
        "cluster": cluster,
        "health_score": health_score,
        "risk_level": risk_level,
        "cluster_description": description,
        "umkm_data": umkm_data
    }

@app.post("/recommendations/business")
async def get_recommendations(request: dict):
    umkm_data = request.get("umkm_data", {})
    
    # Mock cluster info
    cluster_info = {
        "cluster": 1 if random.random() > 0.5 else 0,
        "health_score": 75 if random.random() > 0.5 else 45,
        "risk_level": "rendah" if random.random() > 0.5 else "tinggi"
    }
    
    recommendations = {
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
    
    return {
        "umkm_id": request.get("umkm_id"),
        "cluster_info": cluster_info,
        "recommendations": recommendations
    }

@app.post("/location-recommendations")
async def get_location_recommendations(request: dict):
    return {
        "success": True,
        "data": {
            "recommendations": [
                {
                    "city": "Jakarta",
                    "area_name": "Menteng",
                    "area_type": "Premium",
                    "rent_cost_category": "Tinggi",
                    "compatibility_score": 85.2,
                    "reasons": ["Area komersial dengan traffic tinggi", "Dekat dengan pusat bisnis"],
                    "estimated_foot_traffic": "Tinggi",
                    "target_market": "Kalangan menengah atas",
                    "competition_level": "Sedang"
                }
            ],
            "market_analysis": {
                "market_trends": ["Digital adoption", "Sustainable business"],
                "key_challenges": ["Competition", "Rising costs"],
                "business_opportunities": ["E-commerce integration"],
                "budget_recommendations": ["Pilih lokasi strategis"]
            }
        }
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)