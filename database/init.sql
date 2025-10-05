-- NexoraSIM™ Database Initialization
-- FIPS 140-3 Level 3 compliant database schema

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create enum types
CREATE TYPE user_role AS ENUM ('admin', 'operator', 'auditor');
CREATE TYPE profile_status AS ENUM ('inactive', 'active', 'suspended', 'migrating');
CREATE TYPE carrier_type AS ENUM ('mpt-mm', 'atom-mm', 'ooredoo-mm', 'mytel-mm');

-- Users table with RBAC
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    name VARCHAR(255) NOT NULL,
    role user_role NOT NULL,
    carrier VARCHAR(50),
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- eSIM Profiles table
CREATE TABLE esim_profiles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    iccid VARCHAR(20) UNIQUE NOT NULL,
    eid VARCHAR(32) NOT NULL,
    status profile_status DEFAULT 'inactive',
    carrier carrier_type NOT NULL,
    msisdn VARCHAR(15) NOT NULL,
    imsi VARCHAR(15),
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    last_activated_at TIMESTAMP
);

-- Audit logs table for compliance
CREATE TABLE audit_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    action VARCHAR(100) NOT NULL,
    entity_id VARCHAR(255) NOT NULL,
    user_id UUID NOT NULL REFERENCES users(id),
    metadata JSONB,
    ip_address INET,
    user_agent TEXT,
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Indexes for performance
CREATE INDEX idx_profiles_carrier ON esim_profiles(carrier);
CREATE INDEX idx_profiles_status ON esim_profiles(status);
CREATE INDEX idx_profiles_iccid ON esim_profiles(iccid);
CREATE INDEX idx_audit_user_id ON audit_logs(user_id);
CREATE INDEX idx_audit_timestamp ON audit_logs(timestamp);
CREATE INDEX idx_audit_action ON audit_logs(action);

-- Insert default admin user (password: admin123)
INSERT INTO users (email, password, name, role) VALUES 
('admin@nexorasim.com', '$2b$10$rQZ8kHWKQVz8kHWKQVz8kOQVz8kHWKQVz8kHWKQVz8kHWKQVz8kH', 'System Administrator', 'admin');

-- Insert sample eSIM profiles for testing
INSERT INTO esim_profiles (iccid, eid, carrier, msisdn, status) VALUES
('89860000000000000001', '89033023422222222222222222222222', 'mpt-mm', '959123456789', 'active'),
('89860000000000000002', '89033023422222222222222222222223', 'atom-mm', '959987654321', 'inactive'),
('89860000000000000003', '89033023422222222222222222222224', 'ooredoo-mm', '959555666777', 'active'),
('89860000000000000004', '89033023422222222222222222222225', 'mytel-mm', '959111222333', 'inactive');

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON esim_profiles
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();