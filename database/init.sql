-- My eSIM Plus Database Initialization
-- Production-ready schema with indexes and constraints

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users table
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    name VARCHAR(255) NOT NULL,
    role VARCHAR(50) DEFAULT 'operator',
    is_active BOOLEAN DEFAULT true,
    last_login_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Apple devices table
CREATE TABLE IF NOT EXISTS apple_devices (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    udid VARCHAR(255) UNIQUE NOT NULL,
    serial_number VARCHAR(255),
    imei VARCHAR(255),
    eid VARCHAR(255),
    device_name VARCHAR(255) NOT NULL,
    model VARCHAR(255) NOT NULL,
    os_version VARCHAR(50) NOT NULL,
    is_supervised BOOLEAN DEFAULT false,
    is_user_approved_mdm BOOLEAN DEFAULT false,
    enrollment_status VARCHAR(50) DEFAULT 'enrolled',
    push_magic VARCHAR(255),
    push_token TEXT,
    unlock_token TEXT,
    bootstrap_token TEXT,
    device_information JSONB,
    security_info JSONB,
    restrictions JSONB,
    last_seen TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- MDM commands table
CREATE TABLE IF NOT EXISTS mdm_commands (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    command_uuid VARCHAR(255) UNIQUE NOT NULL,
    request_type VARCHAR(100) NOT NULL,
    command JSONB NOT NULL,
    status VARCHAR(50) DEFAULT 'pending',
    response JSONB,
    error_chain TEXT,
    retry_count INTEGER DEFAULT 0,
    scheduled_at TIMESTAMP,
    sent_at TIMESTAMP,
    completed_at TIMESTAMP,
    device_id UUID NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (device_id) REFERENCES apple_devices(id) ON DELETE CASCADE
);

-- ABM tokens table
CREATE TABLE IF NOT EXISTS abm_tokens (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    org_id VARCHAR(255) UNIQUE NOT NULL,
    org_name VARCHAR(255) NOT NULL,
    server_token TEXT NOT NULL,
    consumer_key TEXT NOT NULL,
    consumer_secret TEXT NOT NULL,
    access_token TEXT NOT NULL,
    access_secret TEXT NOT NULL,
    expires_at TIMESTAMP NOT NULL,
    is_active BOOLEAN DEFAULT true,
    last_sync_at TIMESTAMP,
    capabilities JSONB,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- eSIM profiles table
CREATE TABLE IF NOT EXISTS esim_profiles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    iccid VARCHAR(255) UNIQUE NOT NULL,
    eid VARCHAR(255),
    smdp_address VARCHAR(255) NOT NULL,
    activation_code TEXT NOT NULL,
    confirmation_code VARCHAR(255) NOT NULL,
    carrier VARCHAR(100) NOT NULL,
    plan VARCHAR(255) NOT NULL,
    status VARCHAR(50) DEFAULT 'pending',
    installation_date TIMESTAMP,
    activation_date TIMESTAMP,
    suspension_date TIMESTAMP,
    deletion_date TIMESTAMP,
    profile_data JSONB,
    installation_response JSONB,
    is_transfer_eligible BOOLEAN DEFAULT false,
    transfer_request_id VARCHAR(255),
    device_id UUID,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (device_id) REFERENCES apple_devices(id) ON DELETE SET NULL
);

-- Audit logs table
CREATE TABLE IF NOT EXISTS audit_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID,
    action VARCHAR(100) NOT NULL,
    resource_type VARCHAR(100) NOT NULL,
    resource_id VARCHAR(255),
    details JSONB,
    ip_address INET,
    user_agent TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL
);

-- Profiles table (legacy compatibility)
CREATE TABLE IF NOT EXISTS profiles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    iccid VARCHAR(255) UNIQUE NOT NULL,
    carrier VARCHAR(100) NOT NULL,
    plan VARCHAR(255) NOT NULL,
    status VARCHAR(50) NOT NULL,
    device_id VARCHAR(255),
    metadata JSONB,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_apple_devices_udid ON apple_devices(udid);
CREATE INDEX IF NOT EXISTS idx_apple_devices_serial ON apple_devices(serial_number);
CREATE INDEX IF NOT EXISTS idx_apple_devices_status ON apple_devices(enrollment_status);
CREATE INDEX IF NOT EXISTS idx_apple_devices_last_seen ON apple_devices(last_seen);

CREATE INDEX IF NOT EXISTS idx_mdm_commands_device ON mdm_commands(device_id);
CREATE INDEX IF NOT EXISTS idx_mdm_commands_status ON mdm_commands(status);
CREATE INDEX IF NOT EXISTS idx_mdm_commands_uuid ON mdm_commands(command_uuid);

CREATE INDEX IF NOT EXISTS idx_esim_profiles_iccid ON esim_profiles(iccid);
CREATE INDEX IF NOT EXISTS idx_esim_profiles_device ON esim_profiles(device_id);
CREATE INDEX IF NOT EXISTS idx_esim_profiles_status ON esim_profiles(status);
CREATE INDEX IF NOT EXISTS idx_esim_profiles_carrier ON esim_profiles(carrier);

CREATE INDEX IF NOT EXISTS idx_audit_logs_user ON audit_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_audit_logs_action ON audit_logs(action);
CREATE INDEX IF NOT EXISTS idx_audit_logs_created ON audit_logs(created_at);

-- Insert default admin user
INSERT INTO users (email, password, name, role) 
VALUES ('admin@myesimplus.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'Administrator', 'admin')
ON CONFLICT (email) DO NOTHING;

-- Insert sample data for development
INSERT INTO users (email, password, name, role) 
VALUES 
    ('operator@myesimplus.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'Operator User', 'operator'),
    ('auditor@myesimplus.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'Auditor User', 'auditor')
ON CONFLICT (email) DO NOTHING;