# RBAC Permission Matrix

## Role Definitions

### Admin
- Full system access
- User management
- System configuration
- All carrier access

### Operator
- Profile management within assigned carrier
- Profile activation/deactivation
- CSV import/export
- Analytics viewing

### Auditor
- Read-only access to all data
- Audit log access
- Compliance reporting
- No modification permissions

## Permission Matrix

| Resource | Admin | Operator | Auditor |
|----------|-------|----------|---------|
| **Users** |
| Create User | ✅ | ❌ | ❌ |
| Read User | ✅ | ✅ (own) | ✅ |
| Update User | ✅ | ✅ (own) | ❌ |
| Delete User | ✅ | ❌ | ❌ |
| **Profiles** |
| Create Profile | ✅ | ✅ (own carrier) | ❌ |
| Read Profile | ✅ | ✅ (own carrier) | ✅ |
| Update Profile | ✅ | ✅ (own carrier) | ❌ |
| Delete Profile | ✅ | ❌ | ❌ |
| Activate Profile | ✅ | ✅ (own carrier) | ❌ |
| Deactivate Profile | ✅ | ✅ (own carrier) | ❌ |
| **Analytics** |
| View Dashboard | ✅ | ✅ (own carrier) | ✅ |
| Export Reports | ✅ | ✅ (own carrier) | ✅ |
| **Audit Logs** |
| View Audit Logs | ✅ | ❌ | ✅ |
| Export Audit Logs | ✅ | ❌ | ✅ |
| **System** |
| System Configuration | ✅ | ❌ | ❌ |
| Carrier Management | ✅ | ❌ | ❌ |
| **Import/Export** |
| CSV Import | ✅ | ✅ (own carrier) | ❌ |
| CSV Export | ✅ | ✅ (own carrier) | ✅ |

## Carrier Isolation

### MPT Operator
- Access: `carrier = 'mpt-mm'`
- Profiles: Only MPT eSIM profiles
- Analytics: MPT-specific metrics

### ATOM Operator  
- Access: `carrier = 'atom-mm'`
- Profiles: Only ATOM eSIM profiles
- Analytics: ATOM-specific metrics

### Ooredoo Operator
- Access: `carrier = 'ooredoo-mm'`
- Profiles: Only Ooredoo eSIM profiles
- Analytics: Ooredoo-specific metrics

### Mytel Operator
- Access: `carrier = 'mytel-mm'`
- Profiles: Only Mytel eSIM profiles
- Analytics: Mytel-specific metrics