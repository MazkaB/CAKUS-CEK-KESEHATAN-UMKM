# 🏪 CAKUS - Cek Kesehatan UMKM

<div align="center">
  <img src="https://img.shields.io/badge/Version-1.0.0-blue.svg" alt="Version">
  <img src="https://img.shields.io/badge/License-MIT-green.svg" alt="License">
  <img src="https://img.shields.io/badge/Node.js-18.x-green.svg" alt="Node.js">
  <img src="https://img.shields.io/badge/React-18.2.0-blue.svg" alt="React">
  <img src="https://img.shields.io/badge/Python-3.10+-yellow.svg" alt="Python">
  <img src="https://img.shields.io/badge/MongoDB-Latest-green.svg" alt="MongoDB">
</div>

## 📋 Deskripsi

**CAKUS (Cek Kesehatan UMKM)** adalah sistem komprehensif untuk menganalisis kesehatan dan memberikan rekomendasi bisnis untuk Usaha Mikro, Kecil, dan Menengah (UMKM). Platform ini menggunakan teknologi Machine Learning untuk clustering, analisis risiko, dan memberikan rekomendasi lokasi strategis berbasis data.

### ✨ Fitur Utama

- 🏢 **Manajemen Data UMKM** - Input dan kelola data usaha lengkap
- 📊 **Dashboard Analytics** - Visualisasi data dan statistik bisnis
- 🔍 **Health Check Analysis** - Analisis kesehatan bisnis menggunakan ML
- 🎯 **Business Clustering** - Pengelompokan UMKM berdasarkan performa
- 📈 **Smart Recommendations** - Rekomendasi berbasis AI menggunakan Gemini
- 🗺️ **Location Intelligence** - Analisis dan rekomendasi lokasi strategis
- 📱 **Responsive Design** - Interface yang mobile-friendly

## 🏗️ Arsitektur Sistem

```
CAKUS/
├── 🌐 frontend/          # React.js Application
├── ⚡ backend/           # Node.js Express API
├── 🤖 ml-api/           # Python FastAPI ML Service
├── 📦 shared/           # Shared configs & Docker
└── 📚 docs/             # Documentation
```

### Tech Stack

#### Frontend
- **React 18.2** - Modern UI framework
- **Ant Design 5.4** - Professional UI components
- **React Router DOM** - Client-side routing
- **Recharts** - Data visualization
- **React Leaflet** - Interactive maps
- **Axios** - HTTP client

#### Backend
- **Node.js 18+** - Server runtime
- **Express.js** - Web framework
- **MongoDB** - NoSQL database
- **Mongoose** - ODM for MongoDB
- **JWT** - Authentication
- **Joi** - Data validation
- **Helmet** - Security middleware

#### ML API
- **FastAPI** - High-performance Python API
- **Scikit-learn** - Machine learning
- **Pandas & NumPy** - Data processing
- **Google Gemini AI** - Intelligent recommendations
- **Geopy** - Geolocation services

## 🚀 Quick Start

### Prerequisites

Pastikan Anda telah menginstall:
- **Node.js** 18.x atau lebih tinggi
- **Python** 3.10 atau lebih tinggi
- **MongoDB** (local atau cloud)
- **Docker** & **Docker Compose** (opsional)

### 🐳 Menggunakan Docker (Recommended)

1. **Clone Repository**
   ```bash
   git clone <repository-url>
   cd CAKUS
   ```

2. **Setup Environment Variables**
   ```bash
   cp shared/.env.example shared/.env
   # Edit shared/.env sesuai konfigurasi Anda
   ```

3. **Run dengan Docker Compose**
   ```bash
   cd shared
   docker-compose up -d
   ```

4. **Akses Aplikasi**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:5000
   - ML API: http://localhost:8000
   - MongoDB: http://localhost:27017

### 🔧 Manual Installation

#### 1. Setup Backend

```bash
cd backend
npm install
cp .env.example .env
# Edit .env file
npm run dev
```

#### 2. Setup Frontend

```bash
cd frontend
npm install
npm start
```

#### 3. Setup ML API

```bash
cd ml-api
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate
pip install -r requirements.txt
uvicorn app.main:app --reload --port 8000
```

#### 4. Setup MongoDB

Jalankan MongoDB server dan import data sample:
```bash
mongoimport --db cakus --collection umkms --file shared/mongo-init.js
```

## 📖 API Documentation

### Backend API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/health` | Health check |
| GET | `/api/umkm` | Get all UMKM |
| POST | `/api/umkm` | Create new UMKM |
| GET | `/api/umkm/:id` | Get UMKM by ID |
| PUT | `/api/umkm/:id` | Update UMKM |
| DELETE | `/api/umkm/:id` | Delete UMKM |
| GET | `/api/umkm/dashboard-stats` | Dashboard statistics |

### ML API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/health-check` | Analyze UMKM health |
| POST | `/recommendations` | Get business recommendations |
| POST | `/location-recommendations` | Get location recommendations |
| GET | `/` | API status |

Dokumentasi lengkap tersedia di [docs/API.md](docs/API.md)

## 💡 Cara Penggunaan

### 1. Input Data UMKM
- Akses halaman "Form UMKM"
- Isi data bisnis lengkap (aset, omset, tenaga kerja, dll.)
- Submit untuk menyimpan data

### 2. Analisis Kesehatan
- Pilih UMKM dari dashboard
- Klik "Health Check" untuk analisis ML
- Lihat skor kesehatan dan level risiko

### 3. Dapatkan Rekomendasi
- Sistem otomatis menganalisis performa
- Clustering berdasarkan data bisnis
- Rekomendasi AI untuk improvement

### 4. Analisis Lokasi
- Input data lokasi bisnis
- Dapatkan rekomendasi lokasi strategis
- Visualisasi peta interaktif

## 🔍 Fitur Machine Learning

### Business Clustering
- **Algoritma**: K-Means Clustering
- **Features**: Aset, Omset, Laba, Tenaga Kerja
- **Output**: 2 cluster (Perlu Perbaikan vs Performa Baik)

### Health Scoring
- **Metrik**: ROI, Profit Margin, Employee Efficiency
- **Range**: 0-100 (semakin tinggi semakin sehat)
- **Risk Level**: Rendah, Sedang, Tinggi

### AI Recommendations
- **Engine**: Google Gemini AI
- **Input**: Data bisnis + konteks industri
- **Output**: Rekomendasi strategis & actionable

## 🏢 Model Data

### UMKM Schema
```javascript
{
  nama_usaha: String,
  jenis_usaha: String,
  tenaga_kerja_perempuan: Number,
  tenaga_kerja_laki_laki: Number,
  aset: Number,
  omset: Number,
  laba: Number,
  biaya_karyawan: Number,
  kapasitas_produksi: Number,
  jumlah_pelanggan: Number,
  tahun_berdiri: Number,
  marketplace: String,
  status_legalitas: String,
  cluster: Number,
  health_score: Number,
  risk_level: String
}
```

## 🛠️ Development

### Project Structure
```
├── backend/
│   ├── src/
│   │   ├── controllers/     # Route handlers
│   │   ├── models/         # Database schemas
│   │   ├── routes/         # API routes
│   │   ├── middleware/     # Auth & validation
│   │   └── services/       # Business logic
│   └── server.js           # Entry point
├── frontend/
│   ├── src/
│   │   ├── components/     # React components
│   │   ├── services/       # API calls
│   │   ├── hooks/          # Custom hooks
│   │   └── utils/          # Utilities
│   └── public/             # Static files
├── ml-api/
│   ├── app/
│   │   ├── models/         # ML models
│   │   ├── routers/        # API routes
│   │   ├── services/       # ML services
│   │   └── schemas/        # Pydantic models
│   └── main.py             # FastAPI app
└── shared/
    ├── docker-compose.yml  # Docker orchestration
    └── nginx.conf          # Load balancer config
```

### Available Scripts

#### Backend
```bash
npm start        # Production server
npm run dev      # Development with nodemon
npm test         # Run tests
```

#### Frontend
```bash
npm start        # Development server
npm run build    # Production build
npm test         # Run tests
```

#### ML API
```bash
uvicorn app.main:app --reload    # Development server
python -m pytest                 # Run tests
```

### Environment Variables

#### Backend (.env)
```env
NODE_ENV=development
PORT=5000
MONGODB_URI=mongodb://localhost:27017/cakus
JWT_SECRET=your_secret_key
ML_API_URL=http://localhost:8000
```

#### Frontend (.env)
```env
REACT_APP_API_URL=http://localhost:5000/api
REACT_APP_ML_API_URL=http://localhost:8000
```

#### ML API (.env)
```env
GEMINI_API_KEY=your_gemini_api_key
MONGODB_URI=mongodb://localhost:27017/cakus
MODEL_PATH=./models/
```

## 🧪 Testing

```bash
# Backend tests
cd backend && npm test

# Frontend tests
cd frontend && npm test

# ML API tests
cd ml-api && python -m pytest
```

## 📦 Deployment

### Production Build

1. **Frontend**
   ```bash
   cd frontend
   npm run build
   ```

2. **Backend**
   ```bash
   cd backend
   npm start
   ```

3. **ML API**
   ```bash
   cd ml-api
   uvicorn app.main:app --host 0.0.0.0 --port 8000
   ```

### Docker Production

```bash
cd shared
docker-compose -f docker-compose.prod.yml up -d
```

## 🤝 Contributing

1. Fork repository
2. Create feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Open Pull Request

### Code Style

- **JavaScript**: ESLint + Prettier
- **Python**: Black + Flake8
- **Commits**: Conventional Commits

## 📝 License

Distributed under the MIT License. See [LICENSE](LICENSE) for more information.

## 👥 Team

- **Backend Developer** - Node.js & API Development
- **Frontend Developer** - React.js & UI/UX
- **ML Engineer** - Python & Machine Learning
- **DevOps Engineer** - Docker & Deployment

## 📞 Support

Jika Anda mengalami masalah atau memiliki pertanyaan:

- 📧 Email: support@cakus.id
- 🐛 Issues: [GitHub Issues](https://github.com/your-repo/issues)
- 📖 Docs: [Documentation](docs/)

## 🚀 Roadmap

- [ ] Mobile App (React Native)
- [ ] Advanced Analytics Dashboard
- [ ] Real-time Notifications
- [ ] Multi-language Support
- [ ] Export to PDF/Excel
- [ ] Integration dengan e-commerce platforms
- [ ] Sentiment Analysis untuk review pelanggan

---

<div align="center">
  <p>Made with ❤️ for Indonesian UMKM</p>
  <p>© 2025 CAKUS. All rights reserved.</p>
</div>
