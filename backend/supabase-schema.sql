-- Deep Cleaning Hub Database Schema
-- Simplified schema for mobile app with essential tables only

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =============================================
-- CORE BUSINESS TABLES
-- =============================================

-- Services offered by the company
CREATE TABLE IF NOT EXISTS services (
    id VARCHAR(50) PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    image TEXT,
    category VARCHAR(100) NOT NULL,
    price DECIMAL(10,2) NOT NULL,
    duration VARCHAR(100) NOT NULL,
    features JSONB DEFAULT '[]',
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Mobile app users
CREATE TABLE IF NOT EXISTS mobile_users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    phone VARCHAR(20),
    profile_image TEXT,
    is_active BOOLEAN DEFAULT true,
    email_verified BOOLEAN DEFAULT false,
    last_login TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Service bookings/appointments
CREATE TABLE IF NOT EXISTS service_bookings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES mobile_users(id) ON DELETE CASCADE,
    service_id VARCHAR(50) NOT NULL REFERENCES services(id),
    booking_date DATE NOT NULL,
    booking_time TIME NOT NULL,
    duration_minutes INTEGER NOT NULL,
    status VARCHAR(30) DEFAULT 'scheduled' CHECK (status IN ('scheduled', 'confirmed', 'in_progress', 'completed', 'cancelled')),
    customer_name VARCHAR(255) NOT NULL,
    customer_email VARCHAR(255) NOT NULL,
    customer_phone VARCHAR(20),
    service_address TEXT NOT NULL,
    special_instructions TEXT,
    total_amount DECIMAL(10,2) NOT NULL,
    payment_status VARCHAR(20) DEFAULT 'pending' CHECK (payment_status IN ('pending', 'paid', 'refunded')),
    payment_method VARCHAR(50),
    assigned_staff VARCHAR(255),
    staff_notes TEXT,
    actual_start_time TIMESTAMP WITH TIME ZONE,
    actual_end_time TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Service reviews and ratings
CREATE TABLE IF NOT EXISTS service_reviews (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES mobile_users(id) ON DELETE CASCADE,
    service_id VARCHAR(50) NOT NULL REFERENCES services(id),
    booking_id UUID REFERENCES service_bookings(id) ON DELETE SET NULL,
    rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
    review_text TEXT,
    is_verified BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =============================================
-- ADMIN TABLES
-- =============================================

-- Admin users for backend management
CREATE TABLE IF NOT EXISTS admin_users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    role VARCHAR(50) DEFAULT 'admin' CHECK (role IN ('admin', 'super_admin')),
    is_active BOOLEAN DEFAULT true,
    last_login TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Legacy inquiries table (for backward compatibility)
CREATE TABLE IF NOT EXISTS inquiries (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    customer_name VARCHAR(255) NOT NULL,
    customer_email VARCHAR(255) NOT NULL,
    customer_phone VARCHAR(100) NOT NULL,
    services JSONB NOT NULL,
    total_amount DECIMAL(10,2) NOT NULL,
    message TEXT,
    preferred_date DATE,
    service_area VARCHAR(255),
    status VARCHAR(50) DEFAULT 'pending' CHECK (status IN ('pending', 'contacted', 'confirmed', 'completed', 'cancelled')),
    admin_notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Company settings
CREATE TABLE IF NOT EXISTS company_settings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    setting_key VARCHAR(100) UNIQUE NOT NULL,
    setting_value JSONB NOT NULL,
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =============================================
-- INDEXES FOR PERFORMANCE
-- =============================================

CREATE INDEX IF NOT EXISTS idx_services_category ON services(category);
CREATE INDEX IF NOT EXISTS idx_services_active ON services(is_active);
CREATE INDEX IF NOT EXISTS idx_mobile_users_email ON mobile_users(email);
CREATE INDEX IF NOT EXISTS idx_mobile_users_active ON mobile_users(is_active);
CREATE INDEX IF NOT EXISTS idx_service_bookings_user_id ON service_bookings(user_id);
CREATE INDEX IF NOT EXISTS idx_service_bookings_date ON service_bookings(booking_date);
CREATE INDEX IF NOT EXISTS idx_service_bookings_status ON service_bookings(status);
CREATE INDEX IF NOT EXISTS idx_service_reviews_service_id ON service_reviews(service_id);
CREATE INDEX IF NOT EXISTS idx_service_reviews_rating ON service_reviews(rating);
CREATE INDEX IF NOT EXISTS idx_admin_users_email ON admin_users(email);
CREATE INDEX IF NOT EXISTS idx_inquiries_status ON inquiries(status);
CREATE INDEX IF NOT EXISTS idx_inquiries_created_at ON inquiries(created_at);

-- =============================================
-- TRIGGERS FOR UPDATED_AT
-- =============================================

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_services_updated_at BEFORE UPDATE ON services
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_mobile_users_updated_at BEFORE UPDATE ON mobile_users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_service_bookings_updated_at BEFORE UPDATE ON service_bookings
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_service_reviews_updated_at BEFORE UPDATE ON service_reviews
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_admin_users_updated_at BEFORE UPDATE ON admin_users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_inquiries_updated_at BEFORE UPDATE ON inquiries
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_company_settings_updated_at BEFORE UPDATE ON company_settings
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- =============================================
-- DEFAULT DATA
-- =============================================

-- Insert default company settings
INSERT INTO company_settings (setting_key, setting_value, description) VALUES
('company_info', '{
    "name": "Deep Cleaning Hub",
    "email": "info@deepcleaninghub.com",
    "phone": "+49-16097044182",
    "address": "Germany",
    "serviceAreas": ["Germany", "Europe"],
    "businessHours": "Monday - Friday: 8:00 AM - 6:00 PM"
}', 'Company information and contact details'),
('app_settings', '{
    "version": "1.0.0",
    "maintenanceMode": false,
    "allowRegistrations": true
}', 'Application settings and configuration')
ON CONFLICT (setting_key) DO NOTHING;

-- Insert default super admin user (password: admin123)
INSERT INTO admin_users (name, email, password, role) VALUES
('Super Admin', 'admin@deepcleaninghub.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'super_admin')
ON CONFLICT (email) DO NOTHING;

-- =============================================
-- VIEWS FOR COMMON QUERIES
-- =============================================

-- Service popularity view
CREATE OR REPLACE VIEW service_popularity AS
SELECT
    s.id,
    s.title,
    s.category,
    COUNT(sb.id) as booking_count,
    AVG(sb.total_amount) as avg_amount,
    AVG(sr.rating) as average_rating
FROM services s
LEFT JOIN service_bookings sb ON s.id = sb.service_id AND sb.status = 'completed'
LEFT JOIN service_reviews sr ON s.id = sr.service_id
WHERE s.is_active = true
GROUP BY s.id, s.title, s.category
ORDER BY booking_count DESC;

-- User booking history view
CREATE OR REPLACE VIEW user_booking_history AS
SELECT
    sb.id,
    sb.user_id,
    sb.service_id,
    s.title as service_title,
    s.category,
    sb.booking_date,
    sb.booking_time,
    sb.status,
    sb.total_amount,
    sb.payment_status,
    sb.created_at
FROM service_bookings sb
JOIN services s ON sb.service_id = s.id
WHERE sb.user_id IS NOT NULL
ORDER BY sb.created_at DESC;

-- =============================================
-- SECURITY POLICIES
-- =============================================

-- Enable Row Level Security
ALTER TABLE services ENABLE ROW LEVEL SECURITY;
ALTER TABLE mobile_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE service_bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE service_reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE inquiries ENABLE ROW LEVEL SECURITY;
ALTER TABLE company_settings ENABLE ROW LEVEL SECURITY;

-- Services: Public read access
CREATE POLICY "Services are viewable by everyone" ON services
    FOR SELECT USING (true);

CREATE POLICY "Services are manageable by admins" ON services
    FOR ALL USING (true); -- Admin check handled by auth middleware

-- Mobile Users: Users can manage their own data
CREATE POLICY "Users can view their own profile" ON mobile_users
    FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile" ON mobile_users
    FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Anyone can create mobile user account" ON mobile_users
    FOR INSERT WITH CHECK (true);

-- Service Bookings: Users manage their own bookings
CREATE POLICY "Users can view their own bookings" ON service_bookings
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create bookings" ON service_bookings
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their pending bookings" ON service_bookings
    FOR UPDATE USING (auth.uid() = user_id AND status = 'scheduled');

CREATE POLICY "Admins can manage all bookings" ON service_bookings
    FOR ALL USING (true); -- Admin check handled by auth middleware

-- Service Reviews: Public read, users manage their own
CREATE POLICY "Anyone can view reviews" ON service_reviews
    FOR SELECT USING (true);

CREATE POLICY "Users can manage their own reviews" ON service_reviews
    FOR ALL USING (auth.uid() = user_id);

-- Admin tables: Admin only access
CREATE POLICY "Admin users are manageable by admins" ON admin_users
    FOR ALL USING (true); -- Admin check handled by auth middleware

CREATE POLICY "Inquiries are manageable by admins" ON inquiries
    FOR ALL USING (true); -- Admin check handled by auth middleware

CREATE POLICY "Company settings are manageable by admins" ON company_settings
    FOR ALL USING (true); -- Admin check handled by auth middleware

-- =============================================
-- PERMISSIONS
-- =============================================

GRANT USAGE ON SCHEMA public TO anon, authenticated;
GRANT ALL ON ALL TABLES IN SCHEMA public TO anon, authenticated;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO anon, authenticated;
GRANT ALL ON ALL FUNCTIONS IN SCHEMA public TO anon, authenticated;

-- =============================================
-- COMMENTS
-- =============================================

COMMENT ON TABLE services IS 'Cleaning services offered by Deep Cleaning Hub';
COMMENT ON TABLE mobile_users IS 'Registered mobile app users';
COMMENT ON TABLE service_bookings IS 'Scheduled service appointments and bookings';
COMMENT ON TABLE service_reviews IS 'User reviews and ratings for services';
COMMENT ON TABLE admin_users IS 'Administrative users for the system';
COMMENT ON TABLE inquiries IS 'Legacy customer inquiries (for backward compatibility)';
COMMENT ON TABLE company_settings IS 'Company configuration and settings';

COMMENT ON COLUMN services.features IS 'Array of service features as JSON';
COMMENT ON COLUMN service_bookings.assigned_staff IS 'Staff member assigned to the booking';
COMMENT ON COLUMN inquiries.services IS 'Array of selected services as JSON';
COMMENT ON COLUMN company_settings.setting_value IS 'Setting value stored as JSON for flexibility';
