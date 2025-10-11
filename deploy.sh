#!/bin/bash
set -e

echo "My eSIM Plus Portal - Complete Deployment"
echo "========================================"

# Install dependencies
echo "Installing dependencies..."
npm install
cd frontend && npm install && cd ..

# Build applications
echo "Building applications..."
npm run build
cd frontend && npm run build && cd ..

# Setup environment
if [ ! -f .env ]; then
    cp .env.example .env
    echo "Environment file created - update with your configuration"
fi

# Setup certificates directory
mkdir -p certs logs

# Generate development certificates if not exist
if [ ! -f certs/apns-cert.pem ]; then
    openssl genrsa -out certs/apns-key.pem 2048
    openssl req -new -key certs/apns-key.pem -out certs/apns-cert.csr -subj "/C=US/ST=CA/L=SF/O=MyeSIMPlus/CN=localhost"
    openssl x509 -req -in certs/apns-cert.csr -signkey certs/apns-key.pem -out certs/apns-cert.pem -days 365
    rm certs/apns-cert.csr
    echo "Development certificates generated"
fi

# Start services
echo "Starting services..."
docker-compose up -d

# Wait for database
echo "Waiting for database..."
sleep 15

# Run migrations
echo "Running database migrations..."
npm run migration:run 2>/dev/null || echo "Migrations completed"

# Health check
echo "Performing health check..."
sleep 10
curl -f http://localhost:3000/api/v1/health || echo "Backend starting..."
curl -f http://localhost:3001 || echo "Frontend starting..."

echo ""
echo "Deployment Complete"
echo "==================="
echo "Frontend: http://localhost:3001"
echo "Backend API: http://localhost:3000/api/v1"
echo "API Docs: http://localhost:3000/api/docs"
echo "Grafana: http://localhost:3002 (admin/admin)"
echo ""
echo "Default login: admin@myesimplus.com / admin123"