# My eSIM Plus Portal - Deployment Guide

Complete deployment guide for production environments with AWS infrastructure, Apple platform integration, and enterprise security.

## Quick Deployment

### One-Command Setup (Development)
```bash
git clone https://github.com/myesimplus/enterprise-portal.git
cd enterprise-portal
./scripts/setup.sh
```

### Production Deployment (AWS)
```bash
# 1. Configure AWS credentials
aws configure

# 2. Deploy infrastructure
cd terraform
terraform init
terraform apply

# 3. Deploy application
make aws-deploy
```

## Infrastructure Requirements

### Minimum System Requirements
- **CPU**: 4 vCPUs
- **Memory**: 8GB RAM
- **Storage**: 100GB SSD
- **Network**: 1Gbps bandwidth

### AWS Services Used
- **ECS Fargate**: Container orchestration
- **RDS PostgreSQL**: Primary database
- **ElastiCache Redis**: Caching layer
- **Application Load Balancer**: Traffic distribution
- **KMS**: Encryption key management
- **S3**: File storage
- **CloudWatch**: Monitoring and logging

## Pre-Deployment Checklist

### 1. Apple Platform Prerequisites
- [ ] Apple Developer Program membership
- [ ] Apple Business Manager account
- [ ] APNs certificate generated
- [ ] MDM server configured in ABM
- [ ] Server token downloaded

### 2. AWS Prerequisites
- [ ] AWS account with appropriate permissions
- [ ] AWS CLI configured
- [ ] Terraform installed
- [ ] Docker installed
- [ ] Domain name configured

### 3. Security Prerequisites
- [ ] SSL certificates obtained
- [ ] KMS keys created
- [ ] IAM roles configured
- [ ] Security groups defined

## Step-by-Step Deployment

### Step 1: Infrastructure Setup

```bash
# Clone repository
git clone https://github.com/myesimplus/enterprise-portal.git
cd enterprise-portal

# Configure environment
cp .env.example .env
# Edit .env with your configuration

# Deploy AWS infrastructure
cd terraform
terraform init
terraform plan
terraform apply
```

### Step 2: Apple Platform Configuration

```bash
# Setup APNs certificates
mkdir -p certs
# Copy your APNs certificates to certs/

# Convert certificates to PEM format
openssl pkcs12 -in apns_cert.p12 -out certs/apns-cert.pem -nodes
openssl pkcs12 -in apns_cert.p12 -nocerts -out certs/apns-key.pem -nodes

# Run Apple setup script
./scripts/apple-setup.sh
```

### Step 3: Application Deployment

```bash
# Build Docker images
docker build -t myesimplus-backend .
docker build -t myesimplus-frontend ./frontend

# Tag and push to ECR
aws ecr get-login-password --region us-east-1 | docker login --username AWS --password-stdin YOUR_ECR_URI
docker tag myesimplus-backend:latest YOUR_ECR_URI/myesimplus-backend:latest
docker tag myesimplus-frontend:latest YOUR_ECR_URI/myesimplus-frontend:latest
docker push YOUR_ECR_URI/myesimplus-backend:latest
docker push YOUR_ECR_URI/myesimplus-frontend:latest

# Deploy to ECS
aws ecs update-service --cluster myesimplus-cluster --service myesimplus-service --force-new-deployment
```

### Step 4: Database Migration

```bash
# Run database migrations
aws ecs run-task \
  --cluster myesimplus-cluster \
  --task-definition myesimplus-task \
  --overrides '{
    "containerOverrides": [{
      "name": "myesimplus-backend",
      "command": ["npm", "run", "migration:run"]
    }]
  }' \
  --launch-type FARGATE
```

### Step 5: Verification

```bash
# Check application health
curl -f https://enterprise.myesimplus.com/api/v1/health

# Verify Apple integration
curl -X POST https://enterprise.myesimplus.com/api/v1/apple/apns/test \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{"deviceToken":"test","pushMagic":"test"}'
```

## Environment Configuration

### Production Environment Variables

```bash
# Core Configuration
NODE_ENV=production
PORT=3000
DB_HOST=your-rds-endpoint
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=your-secure-password
DB_NAME=myesimplus

# Security
JWT_SECRET=your-256-bit-secret-key
ENCRYPTION_KEY=your-encryption-key

# Apple Configuration
APNS_CERT_PATH=/app/certs/apns-cert.pem
APNS_KEY_PATH=/app/certs/apns-key.pem
APNS_PRODUCTION=true

# AWS Configuration
AWS_REGION=us-east-1
AWS_KMS_KEY_ID=your-kms-key-id
AWS_S3_BUCKET=your-s3-bucket

# Monitoring
PROMETHEUS_ENABLED=true
LOG_LEVEL=info
```

### SSL Certificate Configuration

```bash
# Generate Let's Encrypt certificate
certbot certonly --standalone -d enterprise.myesimplus.com

# Or use AWS Certificate Manager
aws acm request-certificate \
  --domain-name enterprise.myesimplus.com \
  --validation-method DNS
```

## Monitoring and Alerting

### CloudWatch Dashboards

```json
{
  "widgets": [
    {
      "type": "metric",
      "properties": {
        "metrics": [
          ["AWS/ECS", "CPUUtilization", "ServiceName", "myesimplus-service"],
          ["AWS/ECS", "MemoryUtilization", "ServiceName", "myesimplus-service"]
        ],
        "period": 300,
        "stat": "Average",
        "region": "us-east-1",
        "title": "ECS Metrics"
      }
    }
  ]
}
```

### Alerting Rules

```bash
# Create CloudWatch alarms
aws cloudwatch put-metric-alarm \
  --alarm-name "MyeSIMPlus-HighCPU" \
  --alarm-description "High CPU utilization" \
  --metric-name CPUUtilization \
  --namespace AWS/ECS \
  --statistic Average \
  --period 300 \
  --threshold 80 \
  --comparison-operator GreaterThanThreshold
```

## Security Hardening

### Network Security

```bash
# Configure security groups
aws ec2 create-security-group \
  --group-name myesimplus-alb-sg \
  --description "Security group for ALB"

aws ec2 authorize-security-group-ingress \
  --group-id sg-12345678 \
  --protocol tcp \
  --port 443 \
  --cidr 0.0.0.0/0
```

### Encryption at Rest

```bash
# Enable RDS encryption
aws rds modify-db-instance \
  --db-instance-identifier myesimplus-db \
  --storage-encrypted \
  --kms-key-id your-kms-key-id
```

### WAF Configuration

```bash
# Create WAF web ACL
aws wafv2 create-web-acl \
  --name myesimplus-waf \
  --scope REGIONAL \
  --default-action Allow={} \
  --rules file://waf-rules.json
```

## Backup and Recovery

### Database Backup

```bash
# Automated backup script
#!/bin/bash
BACKUP_NAME="myesimplus-backup-$(date +%Y%m%d-%H%M%S)"
aws rds create-db-snapshot \
  --db-instance-identifier myesimplus-db \
  --db-snapshot-identifier $BACKUP_NAME
```

### Disaster Recovery

```bash
# Cross-region replication
aws rds create-db-instance-read-replica \
  --db-instance-identifier myesimplus-replica \
  --source-db-instance-identifier myesimplus-db \
  --destination-region us-west-2
```

## Performance Optimization

### Auto Scaling Configuration

```bash
# ECS auto scaling
aws application-autoscaling register-scalable-target \
  --service-namespace ecs \
  --scalable-dimension ecs:service:DesiredCount \
  --resource-id service/myesimplus-cluster/myesimplus-service \
  --min-capacity 2 \
  --max-capacity 10
```

### Database Optimization

```sql
-- Performance tuning queries
ANALYZE;
REINDEX DATABASE myesimplus;

-- Monitor slow queries
SELECT query, mean_time, calls 
FROM pg_stat_statements 
ORDER BY mean_time DESC 
LIMIT 10;
```

## Troubleshooting

### Common Issues

#### 1. ECS Task Fails to Start
```bash
# Check task logs
aws logs get-log-events \
  --log-group-name /ecs/myesimplus \
  --log-stream-name ecs/myesimplus-backend/task-id
```

#### 2. Database Connection Issues
```bash
# Test database connectivity
aws rds describe-db-instances \
  --db-instance-identifier myesimplus-db

# Check security groups
aws ec2 describe-security-groups \
  --group-ids sg-12345678
```

#### 3. APNs Certificate Issues
```bash
# Validate certificate
openssl x509 -in certs/apns-cert.pem -text -noout

# Test APNs connectivity
openssl s_client -connect gateway.push.apple.com:2195 \
  -cert certs/apns-cert.pem -key certs/apns-key.pem
```

### Health Checks

```bash
# Application health
curl -f https://enterprise.myesimplus.com/api/v1/health

# Database health
aws rds describe-db-instances \
  --db-instance-identifier myesimplus-db \
  --query 'DBInstances[0].DBInstanceStatus'

# Load balancer health
aws elbv2 describe-target-health \
  --target-group-arn arn:aws:elasticloadbalancing:us-east-1:123456789012:targetgroup/myesimplus-tg/1234567890123456
```

## Maintenance

### Regular Maintenance Tasks

```bash
# Weekly tasks
- Update security patches
- Review CloudWatch logs
- Check certificate expiration
- Backup verification

# Monthly tasks
- Performance review
- Cost optimization
- Security audit
- Capacity planning
```

### Update Procedure

```bash
# Zero-downtime deployment
1. Build new image
2. Push to ECR
3. Update ECS service
4. Monitor health checks
5. Rollback if needed
```

This deployment guide ensures a production-ready My eSIM Plus Portal with enterprise-grade security, monitoring, and scalability.