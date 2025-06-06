# docs/API.md
# CAKUS API Documentation

## Overview
CAKUS (Cek Kesehatan UMKM) API provides endpoints for UMKM management, health analysis, and business recommendations.

## Base URLs
- Backend API: `http://localhost:5000/api`
- ML API: `http://localhost:8000`

## Authentication
Most endpoints require JWT token in the Authorization header:
```
Authorization: Bearer <token>
```

## UMKM Endpoints

### POST /api/umkm
Create new UMKM

**Request Body:**
```json
{
  "nama_usaha": "string",
  "jenis_usaha": "string",
  "tenaga_kerja_perempuan": "number",
  "tenaga_kerja_laki_laki": "number",
  "aset": "number",
  "omset": "number",
  "laba": "number",
  "biaya_karyawan": "number",
  "kapasitas_produksi": "number",
  "jumlah_pelanggan": "number",
  "tahun_berdiri": "number",
  "marketplace": "string",
  "status_legalitas": "string"
}
```

### GET /api/umkm
Get all UMKM with optional filters

**Query Parameters:**
- `page`: Page number (default: 1)
- `limit`: Items per page (default: 10)
- `search`: Search term
- `cluster`: Filter by cluster (0 or 1)
- `risk_level`: Filter by risk level (rendah, sedang, tinggi)
- `jenis_usaha`: Filter by business type

### GET /api/umkm/:id
Get UMKM by ID

### PUT /api/umkm/:id
Update UMKM

### DELETE /api/umkm/:id
Delete UMKM

### GET /api/umkm/dashboard-stats
Get dashboard statistics

## ML API Endpoints

### POST /health-check
Analyze UMKM health

**Request Body:**
```json
{
  "umkm_id": "string",
  "umkm_data": {
    "aset": "number",
    "omset": "number",
    "laba": "number",
    // ... other UMKM fields
  }
}
```

**Response:**
```json
{
  "umkm_id": "string",
  "cluster": "number",
  "health_score": "number",
  "risk_level": "string",
  "cluster_description": "string",
  "umkm_data": "object"
}
```

### POST /recommendations/business
Get business recommendations

**Request Body:**
```json
{
  "umkm_id": "string",
  "umkm_data": "object"
}
```

### POST /location-recommendations
Get location recommendations

**Request Body:**
```json
{
  "jenis_usaha": "string",
  "aset": "number",
  "omset": "number",
  "current_location": "string"
}
```

## Error Responses
All endpoints return errors in this format:
```json
{
  "success": false,
  "error": "Error message"
}
```

Common HTTP status codes:
- 400: Bad Request
- 401: Unauthorized
- 403: Forbidden
- 404: Not Found
- 500: Internal Server Error
