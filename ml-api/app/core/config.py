# ml-api/app/core/config.py
from pydantic_settings import BaseSettings
from typing import Optional

class Settings(BaseSettings):
    # API Settings
    API_V1_STR: str = "/api/v1"
    PROJECT_NAME: str = "CAKUS ML API"
    
    # ML Model Settings
    MODEL_PATH: str = "models/"
    RANDOM_STATE: int = 42
    
    # Google Gemini API
    GEMINI_API_KEY: str = ""
    
    # MongoDB (for caching)
    MONGODB_URL: str = "mongodb://localhost:27017"
    DATABASE_NAME: str = "cakus_ml"
    
    # Location API
    NOMINATIM_USER_AGENT: str = "cakus_app"
    
    class Config:
        env_file = ".env"

settings = Settings()