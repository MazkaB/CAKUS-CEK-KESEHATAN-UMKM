# ml-api/app/routers/recommendations.py
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import Dict, Any
from app.services.gemini_service import gemini_service
from app.models.clustering_model import clustering_model

router = APIRouter()

class RecommendationRequest(BaseModel):
    umkm_id: str
    umkm_data: Dict[str, Any]

@router.post("/business")
async def get_business_recommendations(request: RecommendationRequest):
    """Get AI-powered business recommendations for UMKM"""
    try:
        # First, get cluster analysis
        cluster_info = clustering_model.predict(request.umkm_data)
        
        # Generate recommendations using Gemini
        recommendations = gemini_service.generate_umkm_recommendations(
            request.umkm_data, cluster_info
        )
        
        return {
            "umkm_id": request.umkm_id,
            "cluster_info": cluster_info,
            "recommendations": recommendations,
            "generated_at": "2025-01-01T00:00:00Z"  # Add timestamp
        }
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Recommendation generation failed: {str(e)}")

@router.get("/{umkm_id}")
async def get_recommendations_by_id(umkm_id: str):
    """Get cached recommendations by UMKM ID"""
    # This would typically fetch from database/cache
    return {
        "message": f"Recommendations for UMKM {umkm_id}",
        "note": "This endpoint requires database integration for caching"
    }
