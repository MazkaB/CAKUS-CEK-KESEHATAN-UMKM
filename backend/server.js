// backend/server.js (VERSION TANPA MONGODB)
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const morgan = require('morgan');
require('dotenv').config();

const app = express();

// Security middleware
app.use(helmet());
app.use(cors({
  origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
  credentials: true
}));

// Logging
app.use(morgan('combined'));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});
app.use(limiter);

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Mock database connection (no real database needed)
console.log('✅ Using mock database for development');

// Routes
const umkmRoutes = require('./src/routes/umkm');
app.use('/api/umkm', umkmRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    timestamp: new Date(),
    uptime: process.uptime(),
    memory: process.memoryUsage(),
    database: 'Mock Database (Development Mode)'
  });
});

// Basic route
app.get('/', (req, res) => {
  res.json({ 
    message: 'CAKUS Backend API is running!',
    mode: 'Development with Mock Data',
    endpoints: {
      health: '/api/health',
      umkm: '/api/umkm',
      dashboard: '/api/umkm/dashboard-stats'
    }
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    error: process.env.NODE_ENV === 'production' ? 'Something went wrong!' : err.message
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    error: 'Route not found'
  });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📍 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`🗃️  Database: Mock Data (No MongoDB required)`);
  console.log(`🌐 API Documentation: http://localhost:${PORT}`);
});