# ml-api/app/routers/locations.py
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import Dict, Any, Optional
from app.services.location_service import location_service

router = APIRouter()

class LocationRecommendationRequest(BaseModel):
    jenis_usaha: str
    aset: float
    omset: float
    current_location: Optional[str] = "Jakarta"
    preferences: Optional[Dict[str, Any]] = None

@router.post("/")
async def get_location_recommendations(request: LocationRecommendationRequest):
    """Get location recommendations for UMKM based on business type and budget"""
    try:
        # Convert request to dict format expected by service
        umkm_data = {
            "jenis_usaha": request.jenis_usaha,
            "aset": request.aset,
            "omset": request.omset,
            "current_location": request.current_location
        }
        
        if request.preferences:
            umkm_data.update(request.preferences)
        
        # Get location recommendations
        recommendations = location_service.get_location_recommendations(umkm_data)
        
        return {
            "success": True,
            "data": recommendations,
            "request_info": {
                "business_type": request.jenis_usaha,
                "budget_range": location_service._categorize_budget(umkm_data),
                "current_location": request.current_location
            }
        }
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Location recommendation failed: {str(e)}")

@router.get("/cities")
async def get_available_cities():
    """Get list of available cities for location recommendations"""
    cities = list(location_service.indonesia_business_areas.keys())
    return {
        "cities": cities,
        "total_cities": len(cities)
    }

@router.get("/business-types")
async def get_business_types():
    """Get supported business types and their suitable area types"""
    return {
        "business_types": location_service.business_location_mapping,
        "area_types": {
            "Commercial": "Area komersial dengan traffic tinggi",
            "Tourist": "Area wisata dengan banyak pengunjung",
            "Student": "Area sekitar kampus dengan target mahasiswa",
            "Premium": "Area elit dengan daya beli tinggi",
            "Mixed": "Area campuran dengan berbagai target market",
            "Residential": "Area pemukiman dengan pelanggan tetap",
            "Industrial": "Area industri dengan fokus B2B",
            "Suburban": "Area pinggiran kota dengan biaya rendah"
        }
    }