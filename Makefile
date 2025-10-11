# My eSIM Plus Portal - Production Makefile

.PHONY: help install build test deploy clean

# Default target
help:
	@echo "My eSIM Plus Portal - Available Commands:"
	@echo ""
	@echo "Development:"
	@echo "  make install     - Install all dependencies"
	@echo "  make dev         - Start development environment"
	@echo "  make build       - Build applications"
	@echo "  make test        - Run all tests"
	@echo ""
	@echo "Production:"
	@echo "  make deploy      - Deploy to production"
	@echo "  make docker      - Build Docker images"
	@echo "  make aws-deploy  - Deploy to AWS"
	@echo ""
	@echo "Maintenance:"
	@echo "  make clean       - Clean build artifacts"
	@echo "  make logs        - View application logs"
	@echo "  make backup      - Backup database"

# Development commands
install:
	@echo "Installing dependencies..."
	npm install
	cd frontend && npm install

dev:
	@echo "Starting development environment..."
	docker-compose up -d postgres redis
	npm run dev &
	cd frontend && npm run dev

build:
	@echo "Building applications..."
	npm run build
	cd frontend && npm run build

test:
	@echo "Running tests..."
	npm run test
	npm run test:e2e
	cd frontend && npm run test

# Production commands
deploy: build docker
	@echo "Deploying to production..."
	./scripts/setup.sh

docker:
	@echo "Building Docker images..."
	docker build -t myesimplus-backend .
	docker build -t myesimplus-frontend ./frontend

aws-deploy:
	@echo "Deploying to AWS..."
	cd terraform && terraform apply -auto-approve
	docker tag myesimplus-backend:latest $(ECR_URI)/myesimplus-backend:latest
	docker push $(ECR_URI)/myesimplus-backend:latest

# Maintenance commands
clean:
	@echo "Cleaning build artifacts..."
	rm -rf dist/
	rm -rf frontend/.next/
	rm -rf node_modules/
	rm -rf frontend/node_modules/
	docker system prune -f

logs:
	@echo "Viewing application logs..."
	docker-compose logs -f

backup:
	@echo "Creating database backup..."
	docker exec myesimplus-postgres pg_dump -U postgres myesimplus > backup_$(shell date +%Y%m%d_%H%M%S).sql

# Apple platform setup
apple-setup:
	@echo "Setting up Apple platform integration..."
	./scripts/apple-setup.sh

# Health check
health:
	@echo "Checking application health..."
	curl -f http://localhost:3000/api/v1/health || echo "Backend unhealthy"
	curl -f http://localhost:3001 || echo "Frontend unhealthy"

# Security scan
security:
	@echo "Running security scan..."
	npm audit
	docker run --rm -v $(PWD):/app aquasec/trivy fs /app