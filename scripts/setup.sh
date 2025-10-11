#!/bin/bash

# My eSIM Plus Portal Setup Script
# This script sets up the complete development environment

set -e

echo "🚀 Setting up My eSIM Plus Portal..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check prerequisites
check_prerequisites() {
    print_status "Checking prerequisites..."
    
    # Check Node.js
    if ! command -v node &> /dev/null; then
        print_error "Node.js is not installed. Please install Node.js 18 or higher."
        exit 1
    fi
    
    NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
    if [ "$NODE_VERSION" -lt 18 ]; then
        print_error "Node.js version 18 or higher is required. Current version: $(node -v)"
        exit 1
    fi
    
    # Check Docker
    if ! command -v docker &> /dev/null; then
        print_error "Docker is not installed. Please install Docker."
        exit 1
    fi
    
    # Check Docker Compose
    if ! command -v docker-compose &> /dev/null; then
        print_error "Docker Compose is not installed. Please install Docker Compose."
        exit 1
    fi
    
    print_success "All prerequisites are met!"
}

# Setup environment files
setup_environment() {
    print_status "Setting up environment configuration..."
    
    if [ ! -f .env ]; then
        cp .env.example .env
        print_success "Created .env file from template"
        print_warning "Please update the .env file with your actual configuration values"
    else
        print_warning ".env file already exists, skipping..."
    fi
    
    if [ ! -f frontend/.env.local ]; then
        cat > frontend/.env.local << EOF
NEXT_PUBLIC_API_URL=http://localhost:3000/api/v1
NEXT_PUBLIC_GRAPHQL_URL=http://localhost:3000/graphql
EOF
        print_success "Created frontend/.env.local file"
    fi
}

# Install dependencies
install_dependencies() {
    print_status "Installing backend dependencies..."
    npm install
    
    print_status "Installing frontend dependencies..."
    cd frontend
    npm install
    cd ..
    
    print_success "Dependencies installed successfully!"
}

# Setup certificates directory
setup_certificates() {
    print_status "Setting up certificates directory..."
    
    mkdir -p certs
    
    # Generate self-signed certificates for development
    if [ ! -f certs/apns-cert.pem ]; then
        print_status "Generating development certificates..."
        
        # Generate private key
        openssl genrsa -out certs/apns-key.pem 2048
        
        # Generate certificate signing request
        openssl req -new -key certs/apns-key.pem -out certs/apns-cert.csr -subj "/C=US/ST=CA/L=San Francisco/O=My eSIM Plus/CN=localhost"
        
        # Generate self-signed certificate
        openssl x509 -req -in certs/apns-cert.csr -signkey certs/apns-key.pem -out certs/apns-cert.pem -days 365
        
        # Clean up CSR
        rm certs/apns-cert.csr
        
        print_success "Development certificates generated"
        print_warning "For production, replace with actual APNs certificates from Apple"
    fi
}

# Setup database
setup_database() {
    print_status "Setting up database..."
    
    # Start PostgreSQL container
    docker-compose up -d postgres
    
    # Wait for PostgreSQL to be ready
    print_status "Waiting for PostgreSQL to be ready..."
    sleep 10
    
    # Run database migrations
    print_status "Running database migrations..."
    npm run build
    npm run migration:run
    
    print_success "Database setup completed!"
}

# Build and start services
start_services() {
    print_status "Building and starting all services..."
    
    # Build the application
    npm run build
    cd frontend && npm run build && cd ..
    
    # Start all services
    docker-compose up -d
    
    print_success "All services started successfully!"
}

# Display service URLs
display_urls() {
    print_success "🎉 My eSIM Plus Portal is now running!"
    echo ""
    echo "📱 Frontend:           http://localhost:3001"
    echo "🔧 Backend API:        http://localhost:3000/api/v1"
    echo "📚 API Documentation:  http://localhost:3000/api/docs"
    echo "🔍 GraphQL Playground: http://localhost:3000/graphql"
    echo "📊 Prometheus:         http://localhost:9090"
    echo "📈 Grafana:           http://localhost:3002 (admin/admin)"
    echo ""
    echo "🔐 Default login credentials:"
    echo "   Email: admin@myesimplus.com"
    echo "   Password: admin123"
    echo ""
    print_warning "Remember to:"
    echo "1. Update your .env file with production values"
    echo "2. Replace development certificates with production APNs certificates"
    echo "3. Configure your Apple Business Manager tokens"
    echo "4. Set up your carrier API credentials"
}

# Health check
health_check() {
    print_status "Performing health check..."
    
    # Wait for services to be ready
    sleep 30
    
    # Check backend health
    if curl -f http://localhost:3000/api/v1/health > /dev/null 2>&1; then
        print_success "Backend is healthy"
    else
        print_error "Backend health check failed"
        return 1
    fi
    
    # Check frontend
    if curl -f http://localhost:3001 > /dev/null 2>&1; then
        print_success "Frontend is healthy"
    else
        print_error "Frontend health check failed"
        return 1
    fi
    
    print_success "All services are healthy!"
}

# Main execution
main() {
    echo "🏢 My eSIM Plus - Enterprise eSIM Management Portal"
    echo "=================================================="
    echo ""
    
    check_prerequisites
    setup_environment
    install_dependencies
    setup_certificates
    setup_database
    start_services
    
    if health_check; then
        display_urls
    else
        print_error "Setup completed with errors. Please check the logs."
        exit 1
    fi
}

# Run main function
main "$@"