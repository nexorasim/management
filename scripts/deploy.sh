#!/bin/bash

# NexoraSIM™ Deployment Script
# Production deployment to AWS EKS

set -e

# Configuration
ENVIRONMENT=${1:-staging}
NAMESPACE="nexorasim-${ENVIRONMENT}"
REGION="us-east-1"
CLUSTER_NAME="nexorasim-${ENVIRONMENT}"

echo "🚀 Deploying NexoraSIM™ to ${ENVIRONMENT} environment"

# Check prerequisites
command -v kubectl >/dev/null 2>&1 || { echo "kubectl is required"; exit 1; }
command -v helm >/dev/null 2>&1 || { echo "helm is required"; exit 1; }
command -v aws >/dev/null 2>&1 || { echo "aws cli is required"; exit 1; }

# Configure kubectl
echo "📋 Configuring kubectl for EKS cluster"
aws eks update-kubeconfig --region $REGION --name $CLUSTER_NAME

# Create namespace if not exists
kubectl create namespace $NAMESPACE --dry-run=client -o yaml | kubectl apply -f -

# Deploy secrets
echo "🔐 Deploying secrets"
kubectl apply -f k8s/secrets.yaml -n $NAMESPACE

# Deploy PostgreSQL (if not using RDS)
if [ "$ENVIRONMENT" = "staging" ]; then
    echo "🗄️ Deploying PostgreSQL"
    helm repo add bitnami https://charts.bitnami.com/bitnami
    helm upgrade --install postgres bitnami/postgresql \
        --namespace $NAMESPACE \
        --set auth.postgresPassword=secure123 \
        --set auth.database=nexorasim
fi

# Deploy Redis
echo "📦 Deploying Redis"
helm upgrade --install redis bitnami/redis \
    --namespace $NAMESPACE \
    --set auth.enabled=false

# Deploy Kafka
echo "📨 Deploying Kafka"
helm upgrade --install kafka bitnami/kafka \
    --namespace $NAMESPACE \
    --set zookeeper.enabled=true

# Deploy application
echo "🏗️ Deploying NexoraSIM™ application"
export NAMESPACE=$NAMESPACE
export BACKEND_IMAGE="${CI_REGISTRY_IMAGE}/backend:${CI_COMMIT_SHA:-latest}"
export FRONTEND_IMAGE="${CI_REGISTRY_IMAGE}/frontend:${CI_COMMIT_SHA:-latest}"
export DOMAIN="${ENVIRONMENT}.nexorasim.com"

envsubst < k8s/deployment.yaml | kubectl apply -f -
kubectl apply -f k8s/hpa.yaml -n $NAMESPACE

# Wait for deployment
echo "⏳ Waiting for deployment to complete"
kubectl rollout status deployment/nexorasim-backend -n $NAMESPACE --timeout=300s
kubectl rollout status deployment/nexorasim-frontend -n $NAMESPACE --timeout=300s

# Deploy monitoring (production only)
if [ "$ENVIRONMENT" = "production" ]; then
    echo "📊 Deploying monitoring stack"
    helm repo add prometheus-community https://prometheus-community.github.io/helm-charts
    helm upgrade --install monitoring prometheus-community/kube-prometheus-stack \
        --namespace monitoring --create-namespace \
        --set grafana.adminPassword=admin123
fi

# Health check
echo "🏥 Performing health check"
kubectl get pods -n $NAMESPACE
kubectl get services -n $NAMESPACE
kubectl get ingress -n $NAMESPACE

echo "✅ Deployment completed successfully!"
echo "🌐 Application URL: https://${DOMAIN}"

if [ "$ENVIRONMENT" = "production" ]; then
    echo "📊 Grafana: https://monitoring.nexorasim.com"
    echo "📚 API Docs: https://${DOMAIN}/docs"
fi