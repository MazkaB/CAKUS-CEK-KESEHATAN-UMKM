# ml-api/app/services/location_service.py
import pandas as pd
import numpy as np
from geopy.geocoders import Nominatim
from geopy.distance import geodesic
from typing import Dict, List, Any, Tuple
import random
from app.core.config import settings

class LocationRecommendationService:
    def __init__(self):
        self.geolocator = Nominatim(user_agent=settings.NOMINATIM_USER_AGENT)
        
        # Sample data for business locations in Indonesia (can be extended)
        self.indonesia_business_areas = {
            "Jakarta": {
                "coords": (-6.2088, 106.8456),
                "areas": [
                    {"name": "Menteng", "coords": (-6.1944, 106.8317), "type": "Premium", "rent_cost": "Tinggi"},
                    {"name": "Kemang", "coords": (-6.2615, 106.8161), "type": "Trendy", "rent_cost": "Sedang-Tinggi"},
                    {"name": "Kelapa Gading", "coords": (-6.1588, 106.9056), "type": "Suburban", "rent_cost": "Sedang"},
                    {"name": "Tanah Abang", "coords": (-6.1744, 106.8227), "type": "Commercial", "rent_cost": "Sedang"},
                    {"name": "Cikini", "coords": (-6.1944, 106.8444), "type": "Mixed", "rent_cost": "Sedang"},
                ]
            },
            "Surabaya": {
                "coords": (-7.2575, 112.7521),
                "areas": [
                    {"name": "Gubeng", "coords": (-7.2652, 112.7513), "type": "Commercial", "rent_cost": "Sedang"},
                    {"name": "Darmo", "coords": (-7.2819, 112.7394), "type": "Premium", "rent_cost": "Tinggi"},
                    {"name": "Rungkut", "coords": (-7.3139, 112.7894), "type": "Industrial", "rent_cost": "Rendah-Sedang"},
                ]
            },
            "Bandung": {
                "coords": (-6.9175, 107.6191),
                "areas": [
                    {"name": "Dago", "coords": (-6.8942, 107.6133), "type": "Trendy", "rent_cost": "Sedang-Tinggi"},
                    {"name": "Cihampelas", "coords": (-6.8908, 107.6033), "type": "Commercial", "rent_cost": "Sedang"},
                    {"name": "Buah Batu", "coords": (-6.9428, 107.6333), "type": "Residential", "rent_cost": "Sedang"},
                ]
            },
            "Yogyakarta": {
                "coords": (-7.7956, 110.3695),
                "areas": [
                    {"name": "Malioboro", "coords": (-7.7923, 110.3656), "type": "Tourist", "rent_cost": "Tinggi"},
                    {"name": "Jalan Kaliurang", "coords": (-7.7483, 110.3789), "type": "Student", "rent_cost": "Sedang"},
                    {"name": "Bantul", "coords": (-7.8881, 110.3297), "type": "Suburban", "rent_cost": "Rendah-Sedang"},
                ]
            }
        }
        
        # Business type recommendations
        self.business_location_mapping = {
            "Fashion": ["Trendy", "Commercial", "Tourist"],
            "Jasa": ["Commercial", "Mixed", "Residential"],
            "Kesehatan": ["Residential", "Mixed", "Suburban"],
            "Makanan & Minuman": ["Tourist", "Commercial", "Student"],
            "Pendidikan": ["Residential", "Student", "Suburban"],
            "Perdagangan": ["Commercial", "Industrial", "Mixed"],
            "Perusahaan": ["Commercial", "Premium", "Industrial"]
        }
    
    def get_location_recommendations(self, umkm_data: Dict[str, Any]) -> Dict[str, Any]:
        """Get location recommendations based on UMKM business type and budget"""
        jenis_usaha = umkm_data.get('jenis_usaha', 'Jasa')
        budget_category = self._categorize_budget(umkm_data)
        current_location = umkm_data.get('current_location', 'Jakarta')
        
        # Get suitable area types for business
        suitable_area_types = self.business_location_mapping.get(jenis_usaha, ["Commercial", "Mixed"])
        
        # Generate recommendations
        recommendations = []
        
        for city, city_data in self.indonesia_business_areas.items():
            for area in city_data["areas"]:
                if area["type"] in suitable_area_types:
                    # Calculate compatibility score
                    compatibility_score = self._calculate_compatibility_score(
                        area, jenis_usaha, budget_category
                    )
                    
                    if compatibility_score > 0.6:  # Threshold for recommendation
                        recommendation = {
                            "city": city,
                            "area_name": area["name"],
                            "coordinates": area["coords"],
                            "area_type": area["type"],
                            "rent_cost_category": area["rent_cost"],
                            "compatibility_score": round(compatibility_score * 100, 1),
                            "reasons": self._generate_reasons(area, jenis_usaha, budget_category),
                            "estimated_foot_traffic": self._estimate_foot_traffic(area["type"]),
                            "target_market": self._get_target_market(area["type"]),
                            "competition_level": self._estimate_competition(area["type"], jenis_usaha)
                        }
                        recommendations.append(recommendation)
        
        # Sort by compatibility score
        recommendations.sort(key=lambda x: x["compatibility_score"], reverse=True)
        
        # Get top 10 recommendations
        top_recommendations = recommendations[:10]
        
        # Add market analysis
        market_analysis = self._generate_market_analysis(jenis_usaha, budget_category)
        
        return {
            "recommendations": top_recommendations,
            "market_analysis": market_analysis,
            "business_type": jenis_usaha,
            "budget_category": budget_category,
            "total_options": len(recommendations)
        }
    
    def _categorize_budget(self, umkm_data: Dict[str, Any]) -> str:
        """Categorize budget based on UMKM financial data"""
        aset = umkm_data.get('aset', 0)
        omset = umkm_data.get('omset', 0)
        
        # Simple budget categorization
        if aset > 5000000 and omset > 30000000:
            return "Tinggi"
        elif aset > 2000000 and omset > 15000000:
            return "Sedang"
        else:
            return "Rendah"
    
    def _calculate_compatibility_score(self, area: Dict, jenis_usaha: str, budget_category: str) -> float:
        """Calculate compatibility score between business and location"""
        score = 0.5  # Base score
        
        # Business type compatibility
        suitable_types = self.business_location_mapping.get(jenis_usaha, [])
        if area["type"] in suitable_types:
            score += 0.3
        
        # Budget compatibility
        rent_cost = area["rent_cost"]
        if budget_category == "Tinggi":
            score += 0.2  # Can afford any location
        elif budget_category == "Sedang":
            if rent_cost in ["Sedang", "Sedang-Tinggi", "Rendah-Sedang"]:
                score += 0.2
            elif rent_cost == "Tinggi":
                score -= 0.1
        else:  # Budget rendah
            if rent_cost in ["Rendah-Sedang", "Sedang"]:
                score += 0.2
            elif rent_cost in ["Sedang-Tinggi", "Tinggi"]:
                score -= 0.2
        
        # Add some randomness for variety
        score += random.uniform(-0.05, 0.05)
        
        return max(0, min(1, score))
    
    def _generate_reasons(self, area: Dict, jenis_usaha: str, budget_category: str) -> List[str]:
        """Generate reasons why this location is suitable"""
        reasons = []
        
        area_type = area["type"]
        rent_cost = area["rent_cost"]
        
        # Area type specific reasons
        if area_type == "Commercial":
            reasons.append("Area komersial dengan traffic tinggi")
            reasons.append("Akses mudah untuk pelanggan bisnis")
        elif area_type == "Tourist":
            reasons.append("Banyak wisatawan dan pengunjung")
            reasons.append("Peluang penjualan tinggi")
        elif area_type == "Student":
            reasons.append("Dekat dengan area kampus")
            reasons.append("Target market anak muda yang besar")
        elif area_type == "Residential":
            reasons.append("Dekat dengan pemukiman")
            reasons.append("Pelanggan tetap dari warga sekitar")
        elif area_type == "Premium":
            reasons.append("Area prestigius dengan daya beli tinggi")
            reasons.append("Cocok untuk target market premium")
        elif area_type == "Industrial":
            reasons.append("Biaya operasional relatif rendah")
            reasons.append("Cocok untuk bisnis B2B")
        
        # Business type specific reasons
        if jenis_usaha == "Fashion" and area_type in ["Trendy", "Tourist"]:
            reasons.append("Lokasi strategis untuk tren fashion")
        elif jenis_usaha == "Makanan & Minuman" and area_type in ["Tourist", "Student"]:
            reasons.append("High demand untuk F&B")
        elif jenis_usaha == "Kesehatan" and area_type == "Residential":
            reasons.append("Akses mudah untuk layanan kesehatan")
        
        # Budget compatibility reasons
        if budget_category == "Rendah" and rent_cost in ["Rendah-Sedang"]:
            reasons.append("Sesuai dengan budget yang tersedia")
        elif budget_category == "Tinggi" and rent_cost == "Tinggi":
            reasons.append("Investment grade location")
        
        return reasons[:3]  # Limit to top 3 reasons
    
    def _estimate_foot_traffic(self, area_type: str) -> str:
        """Estimate foot traffic based on area type"""
        traffic_mapping = {
            "Commercial": "Tinggi",
            "Tourist": "Sangat Tinggi",
            "Student": "Tinggi",
            "Premium": "Sedang",
            "Mixed": "Sedang-Tinggi",
            "Residential": "Sedang",
            "Industrial": "Rendah",
            "Suburban": "Sedang"
        }
        return traffic_mapping.get(area_type, "Sedang")
    
    def _get_target_market(self, area_type: str) -> str:
        """Get target market based on area type"""
        market_mapping = {
            "Commercial": "Pekerja kantoran, bisnis",
            "Tourist": "Wisatawan, pengunjung",
            "Student": "Mahasiswa, anak muda",
            "Premium": "Kalangan menengah atas",
            "Mixed": "Beragam, general public",
            "Residential": "Keluarga, warga sekitar",
            "Industrial": "Perusahaan, B2B",
            "Suburban": "Keluarga muda, suburban"
        }
        return market_mapping.get(area_type, "General public")
    
    def _estimate_competition(self, area_type: str, jenis_usaha: str) -> str:
        """Estimate competition level"""
        # Base competition by area type
        base_competition = {
            "Commercial": "Tinggi",
            "Tourist": "Tinggi",
            "Student": "Sedang-Tinggi",
            "Premium": "Sedang",
            "Mixed": "Sedang",
            "Residential": "Rendah-Sedang",
            "Industrial": "Rendah",
            "Suburban": "Rendah-Sedang"
        }
        
        competition = base_competition.get(area_type, "Sedang")
        
        # Adjust based on business type
        if jenis_usaha in ["Fashion", "Makanan & Minuman"]:
            # These typically have higher competition
            if competition == "Rendah":
                competition = "Rendah-Sedang"
            elif competition == "Rendah-Sedang":
                competition = "Sedang"
        
        return competition
    
    def _generate_market_analysis(self, jenis_usaha: str, budget_category: str) -> Dict[str, Any]:
        """Generate market analysis for the business type"""
        
        # Market insights by business type
        market_insights = {
            "Fashion": {
                "trends": ["Sustainable fashion", "Online-to-offline integration", "Local brand preference"],
                "challenges": ["Fast fashion competition", "Seasonal demand", "Inventory management"],
                "opportunities": ["Social media marketing", "Collaboration with influencers", "Customization services"]
            },
            "Makanan & Minuman": {
                "trends": ["Health-conscious eating", "Delivery services", "Instagram-worthy presentation"],
                "challenges": ["Food safety regulations", "High competition", "Rising ingredient costs"],
                "opportunities": ["Cloud kitchen concept", "Franchise opportunities", "Catering services"]
            },
            "Jasa": {
                "trends": ["Digital transformation", "Remote services", "Subscription models"],
                "challenges": ["Service standardization", "Customer acquisition", "Price competition"],
                "opportunities": ["Niche specialization", "B2B partnerships", "Technology integration"]
            },
            "Kesehatan": {
                "trends": ["Preventive healthcare", "Telemedicine", "Wellness focus"],
                "challenges": ["Regulatory compliance", "Insurance partnerships", "Staff retention"],
                "opportunities": ["Home care services", "Health technology", "Corporate wellness"]
            },
            "Pendidikan": {
                "trends": ["Online learning", "Skill-based education", "Lifelong learning"],
                "challenges": ["Technology adaptation", "Quality assurance", "Student retention"],
                "opportunities": ["Hybrid learning models", "Professional certifications", "Corporate training"]
            },
            "Perdagangan": {
                "trends": ["E-commerce integration", "Supply chain efficiency", "Customer experience"],
                "challenges": ["Margin pressure", "Inventory turnover", "Competition from online"],
                "opportunities": ["Omnichannel strategy", "Private labeling", "B2B marketplace"]
            }
        }
        
        insights = market_insights.get(jenis_usaha, {
            "trends": ["Digital adoption", "Customer experience focus"],
            "challenges": ["Competition", "Market saturation"],
            "opportunities": ["Innovation", "Market expansion"]
        })
        
        # Budget-specific recommendations
        budget_recommendations = {
            "Rendah": [
                "Fokus pada lokasi dengan biaya sewa rendah",
                "Manfaatkan media sosial untuk marketing murah",
                "Pertimbangkan sharing space atau co-working"
            ],
            "Sedang": [
                "Pilih lokasi strategis dengan ROI yang baik",
                "Investasi dalam branding dan marketing",
                "Pertimbangkan lokasi dengan growth potential"
            ],
            "Tinggi": [
                "Pilih prime location untuk maksimum visibility",
                "Investasi dalam premium fitting dan equipment",
                "Pertimbangkan multiple locations"
            ]
        }
        
        return {
            "market_trends": insights.get("trends", []),
            "key_challenges": insights.get("challenges", []),
            "business_opportunities": insights.get("opportunities", []),
            "budget_recommendations": budget_recommendations.get(budget_category, []),
            "market_size_indicator": "Growing" if jenis_usaha in ["Kesehatan", "Pendidikan", "Jasa"] else "Stable"
        }

# Initialize global service
location_service = LocationRecommendationService()