# NexoraSIM™ API Documentation

## Base URLs
- **Development**: http://localhost:3000
- **Staging**: https://staging-api.nexorasim.com
- **Production**: https://api.nexorasim.com

## Authentication

### Login
```http
POST /auth/login
Content-Type: application/json

{
  "email": "admin@nexorasim.com",
  "password": "admin123"
}
```

**Response:**
```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "uuid",
    "email": "admin@nexorasim.com",
    "name": "System Administrator",
    "role": "admin",
    "carrier": null
  }
}
```

### Authorization Header
```http
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

## REST API Endpoints

### Profiles

#### Get All Profiles
```http
GET /profiles?carrier=mpt-mm
Authorization: Bearer {token}
```

**Response:**
```json
[
  {
    "id": "uuid",
    "iccid": "89860000000000000001",
    "eid": "89033023422222222222222222222222",
    "status": "active",
    "carrier": "mpt-mm",
    "msisdn": "959123456789",
    "isActive": true,
    "createdAt": "2023-12-01T00:00:00Z",
    "updatedAt": "2023-12-01T00:00:00Z",
    "lastActivatedAt": "2023-12-01T00:00:00Z"
  }
]
```

#### Get Profile by ID
```http
GET /profiles/{id}
Authorization: Bearer {token}
```

#### Activate Profile
```http
PUT /profiles/{id}/activate
Authorization: Bearer {token}
```

#### Deactivate Profile
```http
PUT /profiles/{id}/deactivate
Authorization: Bearer {token}
```

#### Import Profiles (CSV)
```http
POST /profiles/import
Authorization: Bearer {token}
Content-Type: multipart/form-data

file: profiles.csv
```

**CSV Format:**
```csv
iccid,eid,carrier,msisdn,status
89860000000000000001,89033023422222222222222222222222,mpt-mm,959123456789,active
89860000000000000002,89033023422222222222222222222223,atom-mm,959987654321,inactive
```

#### Get Analytics
```http
GET /profiles/analytics?carrier=mpt-mm
Authorization: Bearer {token}
```

**Response:**
```json
{
  "total": 100,
  "active": 60,
  "inactive": 40,
  "carrier": "mpt-mm"
}
```

### Carriers

#### Get All Carriers
```http
GET /carriers
Authorization: Bearer {token}
```

**Response:**
```json
[
  {
    "id": "mpt-mm",
    "name": "MPT Myanmar",
    "pmsEndpoint": "https://pms.mpt.com.mm/api",
    "entitlementEndpoint": "https://entitlement.mpt.com.mm/api",
    "isActive": true
  }
]
```

### Audit Logs

#### Get Audit Logs
```http
GET /audit?limit=100
Authorization: Bearer {token}
```

**Response:**
```json
[
  {
    "id": "uuid",
    "action": "PROFILE_ACTIVATED",
    "entityId": "profile-uuid",
    "userId": "user-uuid",
    "metadata": {
      "carrier": "mpt-mm",
      "iccid": "89860000000000000001"
    },
    "ipAddress": "192.168.1.1",
    "userAgent": "Mozilla/5.0...",
    "timestamp": "2023-12-01T00:00:00Z"
  }
]
```

## GraphQL API

### Endpoint
```
POST /graphql
Authorization: Bearer {token}
Content-Type: application/json
```

### Queries

#### Get Profiles
```graphql
query GetProfiles($carrier: String) {
  profiles(carrier: $carrier) {
    id
    iccid
    eid
    status
    carrier
    msisdn
    isActive
    createdAt
    updatedAt
    lastActivatedAt
  }
}
```

#### Get Profile Analytics
```graphql
query GetProfileAnalytics($carrier: String) {
  profileAnalytics(carrier: $carrier)
}
```

### Mutations

#### Activate Profile
```graphql
mutation ActivateProfile($id: String!) {
  activateProfile(id: $id) {
    id
    status
    lastActivatedAt
  }
}
```

#### Deactivate Profile
```graphql
mutation DeactivateProfile($id: String!) {
  deactivateProfile(id: $id) {
    id
    status
  }
}
```

## Error Responses

### 400 Bad Request
```json
{
  "statusCode": 400,
  "message": "Validation failed",
  "error": "Bad Request"
}
```

### 401 Unauthorized
```json
{
  "statusCode": 401,
  "message": "Unauthorized",
  "error": "Unauthorized"
}
```

### 403 Forbidden
```json
{
  "statusCode": 403,
  "message": "Insufficient permissions",
  "error": "Forbidden"
}
```

### 404 Not Found
```json
{
  "statusCode": 404,
  "message": "Profile not found",
  "error": "Not Found"
}
```

### 500 Internal Server Error
```json
{
  "statusCode": 500,
  "message": "Internal server error",
  "error": "Internal Server Error"
}
```

## Rate Limiting

- **Authenticated requests**: 1000 requests per hour
- **Unauthenticated requests**: 100 requests per hour
- **CSV import**: 10 requests per hour

## Pagination

For endpoints returning lists, use query parameters:
```http
GET /profiles?page=1&limit=50&sortBy=createdAt&sortOrder=desc
```

## Filtering

### Profile Filters
- `carrier`: Filter by carrier (mpt-mm, atom-mm, ooredoo-mm, mytel-mm)
- `status`: Filter by status (active, inactive, suspended, migrating)
- `createdAfter`: ISO date string
- `createdBefore`: ISO date string

Example:
```http
GET /profiles?carrier=mpt-mm&status=active&createdAfter=2023-12-01T00:00:00Z
```

## Webhooks

### Profile Status Change
```http
POST {webhook_url}
Content-Type: application/json
X-Nexora-Signature: sha256=...

{
  "event": "profile.status_changed",
  "data": {
    "profileId": "uuid",
    "oldStatus": "inactive",
    "newStatus": "active",
    "carrier": "mpt-mm",
    "timestamp": "2023-12-01T00:00:00Z"
  }
}
```

## SDK Examples

### JavaScript/Node.js
```javascript
const axios = require('axios');

const client = axios.create({
  baseURL: 'https://api.nexorasim.com',
  headers: {
    'Authorization': 'Bearer ' + token
  }
});

// Get profiles
const profiles = await client.get('/profiles?carrier=mpt-mm');

// Activate profile
await client.put(`/profiles/${profileId}/activate`);
```

### Python
```python
import requests

headers = {'Authorization': f'Bearer {token}'}
base_url = 'https://api.nexorasim.com'

# Get profiles
response = requests.get(f'{base_url}/profiles', 
                       params={'carrier': 'mpt-mm'}, 
                       headers=headers)
profiles = response.json()

# Activate profile
requests.put(f'{base_url}/profiles/{profile_id}/activate', 
            headers=headers)
```

### cURL
```bash
# Get profiles
curl -H "Authorization: Bearer $TOKEN" \
     "https://api.nexorasim.com/profiles?carrier=mpt-mm"

# Activate profile
curl -X PUT \
     -H "Authorization: Bearer $TOKEN" \
     "https://api.nexorasim.com/profiles/$PROFILE_ID/activate"
```