# NexoraSIM™ Deployment Guide

## Prerequisites

### Local Development
```bash
# Required tools
node --version  # v18+
docker --version
docker-compose --version
```

### Production Deployment
```bash
# Required tools
kubectl version
helm version
aws --version
terraform --version
```

## Local Development Setup

### 1. Clone Repository
```bash
git clone https://github.com/nexorasim/management.git
cd management
```

### 2. Environment Configuration
```bash
# Copy environment template
cp .env.example .env

# Edit environment variables
DATABASE_URL=postgresql://nexora:secure123@localhost:5432/nexorasim
JWT_SECRET=your-jwt-secret-key
HSM_ENDPOINT=https://cloudhsm.us-east-1.amazonaws.com
```

### 3. Start Services
```bash
# Start all services with Docker Compose
docker-compose up -d

# Install dependencies
npm install
cd frontend && npm install

# Start development servers
npm run dev
```

### 4. Database Setup
```bash
# Run database migrations
npm run migration:run

# Seed initial data
npm run seed
```

### 5. Access Applications
- **Backend API**: http://localhost:3000
- **Frontend Portal**: http://localhost:3001
- **API Documentation**: http://localhost:3000/docs
- **GraphQL Playground**: http://localhost:3000/graphql
- **Grafana Dashboard**: http://localhost:3002

## Production Deployment

### 1. Infrastructure Setup (Terraform)
```bash
cd terraform

# Initialize Terraform
terraform init

# Plan infrastructure
terraform plan -var="db_password=secure_password"

# Apply infrastructure
terraform apply -var="db_password=secure_password"
```

### 2. Kubernetes Deployment
```bash
# Configure kubectl for EKS
aws eks update-kubeconfig --region us-east-1 --name nexorasim-production

# Deploy using script
./scripts/deploy.sh production
```

### 3. Manual Kubernetes Deployment
```bash
# Create namespace
kubectl create namespace nexorasim-production

# Deploy secrets
kubectl apply -f k8s/secrets.yaml -n nexorasim-production

# Deploy application
kubectl apply -f k8s/deployment.yaml -n nexorasim-production
kubectl apply -f k8s/hpa.yaml -n nexorasim-production

# Check deployment status
kubectl get pods -n nexorasim-production
kubectl get services -n nexorasim-production
```

## CI/CD Pipeline (GitLab)

### 1. GitLab Variables Setup
```bash
# Required CI/CD variables in GitLab
CI_REGISTRY_IMAGE=registry.gitlab.com/nexorasim/management
KUBE_CONTEXT_STAGING=nexorasim-staging
KUBE_CONTEXT_PROD=nexorasim-production
DB_PASSWORD=secure_password
JWT_SECRET=jwt-secret-key
```

### 2. Pipeline Stages
1. **Build**: Docker image creation
2. **Test**: Unit, integration, security tests
3. **Deploy**: Blue-green deployment to EKS

### 3. Deployment Process
```bash
# Automatic deployment to staging (develop branch)
git push origin develop

# Manual deployment to production (main branch)
git push origin main
# Then manually trigger production deployment in GitLab
```

## Monitoring Setup

### 1. Prometheus & Grafana
```bash
# Deploy monitoring stack
helm repo add prometheus-community https://prometheus-community.github.io/helm-charts
helm install monitoring prometheus-community/kube-prometheus-stack \
  --namespace monitoring --create-namespace
```

### 2. ELK Stack
```bash
# Deploy Elasticsearch
helm repo add elastic https://helm.elastic.co
helm install elasticsearch elastic/elasticsearch --namespace logging --create-namespace

# Deploy Kibana
helm install kibana elastic/kibana --namespace logging
```

## Security Configuration

### 1. AWS CloudHSM Setup
```bash
# Create CloudHSM cluster (production only)
aws cloudhsmv2 create-cluster \
  --hsm-type hsm1.medium \
  --subnet-ids subnet-12345 subnet-67890
```

### 2. SSL/TLS Certificates
```bash
# Install cert-manager
kubectl apply -f https://github.com/jetstack/cert-manager/releases/download/v1.13.0/cert-manager.yaml

# Configure Let's Encrypt issuer
kubectl apply -f k8s/cert-issuer.yaml
```

## Database Management

### 1. Backup Strategy
```bash
# Automated RDS backups (configured in Terraform)
# Manual backup
pg_dump -h rds-endpoint -U nexora nexorasim > backup.sql
```

### 2. Migration
```bash
# Run database migrations
npm run migration:run

# Rollback migration
npm run migration:revert
```

## Scaling Configuration

### 1. Horizontal Pod Autoscaler
```yaml
# Already configured in k8s/hpa.yaml
# Scales based on CPU/Memory usage
minReplicas: 3
maxReplicas: 10
targetCPUUtilizationPercentage: 70
```

### 2. Cluster Autoscaler
```bash
# Configure cluster autoscaler for EKS
kubectl apply -f https://raw.githubusercontent.com/kubernetes/autoscaler/master/cluster-autoscaler/cloudprovider/aws/examples/cluster-autoscaler-autodiscover.yaml
```

## Troubleshooting

### 1. Common Issues
```bash
# Check pod logs
kubectl logs -f deployment/nexorasim-backend -n nexorasim-production

# Check service status
kubectl get svc -n nexorasim-production

# Check ingress
kubectl describe ingress nexorasim-ingress -n nexorasim-production
```

### 2. Database Connection Issues
```bash
# Test database connection
kubectl run -it --rm debug --image=postgres:15 --restart=Never -- psql -h rds-endpoint -U nexora -d nexorasim
```

### 3. Performance Issues
```bash
# Check resource usage
kubectl top pods -n nexorasim-production
kubectl top nodes
```

## Health Checks

### 1. Application Health
```bash
# Backend health check
curl https://api.nexorasim.com/health

# Frontend health check
curl https://nexorasim.com
```

### 2. Database Health
```bash
# Check database connections
kubectl exec -it deployment/nexorasim-backend -n nexorasim-production -- npm run db:check
```

## Rollback Procedures

### 1. Application Rollback
```bash
# Rollback to previous version
kubectl rollout undo deployment/nexorasim-backend -n nexorasim-production
kubectl rollout undo deployment/nexorasim-frontend -n nexorasim-production
```

### 2. Database Rollback
```bash
# Rollback database migration
npm run migration:revert
```

## Disaster Recovery

### 1. Backup Restoration
```bash
# Restore from RDS snapshot
aws rds restore-db-instance-from-db-snapshot \
  --db-instance-identifier nexorasim-restored \
  --db-snapshot-identifier nexorasim-snapshot-20231201
```

### 2. Multi-Region Setup
```bash
# Deploy to secondary region
terraform apply -var="aws_region=us-west-2" -var="environment=dr"
```