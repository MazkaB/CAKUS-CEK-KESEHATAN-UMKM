# docs/DEPLOYMENT.md
# CAKUS Deployment Guide

## Prerequisites
- Docker and Docker Compose
- Node.js 18+ (for local development)
- Python 3.11+ (for ML development)
- MongoDB 6.0+

## Environment Setup

1. **Clone the repository:**
```bash
git clone <repository-url>
cd CAKUS
```

2. **Create environment file:**
```bash
cp shared/.env.example .env
```

3. **Configure environment variables:**
Edit `.env` file with your specific values, especially:
- `GEMINI_API_KEY`: Get from Google AI Studio
- `MONGODB_URI`: MongoDB connection string
- `JWT_SECRET`: Strong secret key for JWT

## Development Deployment

### Using Docker Compose (Recommended)

1. **Start all services:**
```bash
docker-compose up -d
```

2. **Check service status:**
```bash
docker-compose ps
```

3. **View logs:**
```bash
docker-compose logs -f
```

### Manual Setup

1. **Start MongoDB:**
```bash
mongod --dbpath /your/db/path
```

2. **Start Backend:**
```bash
cd backend
npm install
npm run dev
```

3. **Start ML API:**
```bash
cd ml-api
pip install -r requirements.txt
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

4. **Start Frontend:**
```bash
cd frontend
npm install
npm start
```

## Production Deployment

### Docker Production Setup

1. **Build production images:**
```bash
docker-compose -f docker-compose.prod.yml build
```

2. **Deploy with SSL:**
```bash
docker-compose -f docker-compose.prod.yml up -d
```

### Cloud Deployment (AWS/GCP/Azure)

1. **Container Registry:**
```bash
# Tag images
docker tag cakus_frontend:latest your-registry/cakus-frontend:latest
docker tag cakus_backend:latest your-registry/cakus-backend:latest
docker tag cakus_ml_api:latest your-registry/cakus-ml-api:latest

# Push to registry
docker push your-registry/cakus-frontend:latest
docker push your-registry/cakus-backend:latest
docker push your-registry/cakus-ml-api:latest
```

2. **Kubernetes Deployment:**
```yaml
# k8s/deployment.yml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: cakus-frontend
spec:
  replicas: 2
  selector:
    matchLabels:
      app: cakus-frontend
  template:
    metadata:
      labels:
        app: cakus-frontend
    spec:
      containers:
      - name: frontend
        image: your-registry/cakus-frontend:latest
        ports:
        - containerPort: 80
```

## Database Migration

1. **Initialize database:**
```bash
docker exec -it cakus_mongodb mongo --eval "load('/docker-entrypoint-initdb.d/mongo-init.js')"
```

2. **Backup database:**
```bash
docker exec cakus_mongodb mongodump --out /backup
```

3. **Restore database:**
```bash
docker exec cakus_mongodb mongorestore /backup
```

## Monitoring and Maintenance

1. **Health Checks:**
- Frontend: `http://localhost:3000`
- Backend: `http://localhost:5000/api/health`
- ML API: `http://localhost:8000/health`

2. **Log Management:**
```bash
# View application logs
docker-compose logs cakus_backend
docker-compose logs cakus_ml_api

# Rotate logs
docker-compose exec backend logrotate /etc/logrotate.conf
```

3. **Performance Monitoring:**
```bash
# Resource usage
docker stats

# Database performance
docker exec cakus_mongodb mongo --eval "db.stats()"
```

## Troubleshooting

### Common Issues

1. **Port conflicts:**
```bash
# Check port usage
netstat -tulpn | grep :3000
netstat -tulpn | grep :5000
netstat -tulpn | grep :8000
```

2. **MongoDB connection issues:**
```bash
# Check MongoDB status
docker exec cakus_mongodb mongo --eval "db.runCommand('ping')"
```

3. **ML API memory issues:**
```bash
# Increase memory limit
docker-compose up -d --scale ml-api=1 --memory=2g ml-api
```

4. **Frontend build issues:**
```bash
# Clear npm cache
npm cache clean --force
rm -rf node_modules package-lock.json
npm install
```

## Security Considerations

1. **Environment Variables:**
- Never commit `.env` files
- Use strong passwords and secrets
- Rotate API keys regularly

2. **Network Security:**
- Use HTTPS in production
- Configure firewall rules
- Implement rate limiting

3. **Database Security:**
- Enable MongoDB authentication
- Use encrypted connections
- Regular security updates

## Scaling

1. **Horizontal Scaling:**
```bash
# Scale services
docker-compose up -d --scale backend=3 --scale ml-api=2
```

2. **Load Balancing:**
- Use Nginx or cloud load balancers
- Implement session stickiness if needed

3. **Database Scaling:**
- MongoDB replica sets
- Read replicas for analytics
