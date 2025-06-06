# ml-api/app/routers/health_check.py
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import Dict, Any
from app.models.clustering_model import clustering_model
from app.schemas.umkm import UMKMData, HealthCheckResponse

router = APIRouter()

class HealthCheckRequest(BaseModel):
    umkm_id: str
    umkm_data: Dict[str, Any]

@router.post("/", response_model=HealthCheckResponse)
async def check_umkm_health(request: HealthCheckRequest):
    """Analyze UMKM health using clustering model"""
    try:
        # Predict cluster and health metrics
        result = clustering_model.predict(request.umkm_data)
        
        return HealthCheckResponse(
            umkm_id=request.umkm_id,
            cluster=result['cluster'],
            health_score=result['health_score'],
            risk_level=result['risk_level'],
            cluster_description=result['cluster_description'],
            umkm_data=request.umkm_data
        )
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Health check failed: {str(e)}")

@router.get("/{umkm_id}")
async def get_health_check_by_id(umkm_id: str):
    """Get health check result by UMKM ID (placeholder for database integration)"""
    # This would typically fetch from database
    # For now, return a sample response
    return {
        "message": f"Health check for UMKM {umkm_id}",
        "note": "This endpoint requires database integration"
    }