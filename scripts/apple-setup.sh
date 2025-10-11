#!/bin/bash

# Apple Platform Integration Setup Script
# Automates APNs certificate setup and ABM token registration

set -e

echo "🍎 Apple Platform Integration Setup"
echo "=================================="

# Colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

print_success() { echo -e "${GREEN}[SUCCESS]${NC} $1"; }
print_warning() { echo -e "${YELLOW}[WARNING]${NC} $1"; }
print_error() { echo -e "${RED}[ERROR]${NC} $1"; }

# Check if certificates exist
check_certificates() {
    echo "Checking APNs certificates..."
    
    if [[ ! -f "certs/apns-cert.pem" || ! -f "certs/apns-key.pem" ]]; then
        print_warning "APNs certificates not found"
        echo "Please follow these steps:"
        echo "1. Log in to Apple Developer Portal"
        echo "2. Create APNs certificate for MDM"
        echo "3. Download and convert to PEM format:"
        echo "   openssl pkcs12 -in cert.p12 -out certs/apns-cert.pem -nodes"
        echo "   openssl pkcs12 -in cert.p12 -nocerts -out certs/apns-key.pem -nodes"
        return 1
    fi
    
    # Validate certificate
    if openssl x509 -in certs/apns-cert.pem -noout -checkend 2592000; then
        print_success "APNs certificate is valid"
    else
        print_warning "APNs certificate expires within 30 days"
    fi
}

# Setup ABM token
setup_abm_token() {
    echo "Setting up Apple Business Manager token..."
    
    read -p "Enter your ABM Organization ID: " ORG_ID
    read -p "Enter your Organization Name: " ORG_NAME
    read -p "Enter path to server token file: " TOKEN_FILE
    
    if [[ ! -f "$TOKEN_FILE" ]]; then
        print_error "Server token file not found: $TOKEN_FILE"
        return 1
    fi
    
    # Extract token content
    TOKEN_CONTENT=$(openssl smime -verify -in "$TOKEN_FILE" -inform DER -noverify 2>/dev/null || cat "$TOKEN_FILE")
    
    # Register token via API
    curl -X POST http://localhost:3000/api/v1/apple/abm/tokens \
        -H "Content-Type: application/json" \
        -H "Authorization: Bearer $ADMIN_TOKEN" \
        -d "{
            \"orgId\": \"$ORG_ID\",
            \"orgName\": \"$ORG_NAME\",
            \"serverToken\": \"$TOKEN_CONTENT\",
            \"consumerKey\": \"$CONSUMER_KEY\",
            \"consumerSecret\": \"$CONSUMER_SECRET\"
        }" && print_success "ABM token registered successfully"
}

# Test APNs connectivity
test_apns() {
    echo "Testing APNs connectivity..."
    
    if openssl s_client -connect gateway.push.apple.com:2195 -cert certs/apns-cert.pem -key certs/apns-key.pem -verify_return_error < /dev/null; then
        print_success "APNs connectivity test passed"
    else
        print_error "APNs connectivity test failed"
        return 1
    fi
}

# Main execution
main() {
    if check_certificates && test_apns; then
        print_success "Apple platform setup completed successfully"
        echo ""
        echo "Next steps:"
        echo "1. Configure your ABM server in Apple Business Manager"
        echo "2. Assign devices to your MDM profile"
        echo "3. Test device enrollment"
    else
        print_error "Apple platform setup incomplete"
        exit 1
    fi
}

main "$@"