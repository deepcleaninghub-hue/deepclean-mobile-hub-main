-- =====================================================
-- SIMPLIFIED SERVICES INSERT
-- Based on exact pricing structure provided
-- =====================================================

-- =====================================================
-- INSERT SERVICES WITH CORRECT PRICING
-- =====================================================

-- Insert Kitchen Assembly service
INSERT INTO services (id, title, description, category, pricing_type, unit_measure, is_active) VALUES
('kitchen-assembly', 'Kitchen Assembly', 'Professional kitchen assembly and disassembly services', 'Assembly', 'fixed', NULL, true);

-- Insert Cleaning service
INSERT INTO services (id, title, description, category, pricing_type, unit_measure, is_active) VALUES
('cleaning', 'Cleaning', 'Professional cleaning services per square meter', 'Cleaning', 'per_unit', 'sqm', true);

-- Insert Furniture Assembly service
INSERT INTO services (id, title, description, category, pricing_type, unit_measure, is_active) VALUES
('furniture-assembly', 'Furniture Assembly', 'Professional furniture assembly services', 'Assembly', 'fixed', NULL, true);

-- Insert Kitchen Disassembly service
INSERT INTO services (id, title, description, category, pricing_type, unit_measure, is_active) VALUES
('kitchen-disassembly', 'Kitchen Disassembly', 'Professional kitchen disassembly services for all sizes', 'Assembly', 'fixed', NULL, true);

-- Insert Furniture Disassembly service
INSERT INTO services (id, title, description, category, pricing_type, unit_measure, is_active) VALUES
('furniture-disassembly', 'Furniture Disassembly', 'Professional furniture disassembly services', 'Assembly', 'fixed', NULL, true);

-- Insert Painting service
INSERT INTO services (id, title, description, category, pricing_type, unit_measure, is_active) VALUES
('painting', 'Painting', 'Professional painting services per square meter', 'Painting', 'per_unit', 'sqm', true);

-- Insert Office Setup service
INSERT INTO services (id, title, description, category, pricing_type, unit_measure, is_active) VALUES
('office-setup', 'Office Setup', 'Complete office furniture assembly and setup', 'Assembly', 'fixed', NULL, true);

-- =====================================================
-- INSERT SERVICE OPTIONS WITH CORRECT PRICING
-- =====================================================

-- Kitchen Assembly Options
INSERT INTO service_options (id, service_id, title, description, price, duration, pricing_type, display_order, is_active) VALUES
('kitchen-small-assembly', 'kitchen-assembly', 'Small Kitchen Assembly (6-10 sqm)', 'Professional assembly of small kitchen units including cabinets, appliances, and fixtures', 300.00, '2-4 hours', 'fixed', 1, true),
('kitchen-medium-assembly', 'kitchen-assembly', 'Medium Kitchen Assembly (10-15 sqm)', 'Professional assembly of medium kitchen units including cabinets, appliances, and fixtures', 600.00, '4-6 hours', 'fixed', 2, true),
('kitchen-large-assembly', 'kitchen-assembly', 'Large Kitchen Assembly (20-25 sqm)', 'Professional assembly of large kitchen units including cabinets, appliances, and fixtures', 900.00, '6-8 hours', 'fixed', 3, true);

-- Kitchen Disassembly Options
INSERT INTO service_options (id, service_id, title, description, price, duration, pricing_type, display_order, is_active) VALUES
('kitchen-small-disassembly', 'kitchen-disassembly', 'Small Kitchen Disassembly (6-10 sqm)', 'Professional disassembly of small kitchen units with careful handling', 300.00, '2-4 hours', 'fixed', 1, true),
('kitchen-medium-disassembly', 'kitchen-disassembly', 'Medium Kitchen Disassembly (10-15 sqm)', 'Professional disassembly of medium kitchen units with careful handling', 600.00, '4-6 hours', 'fixed', 2, true),
('kitchen-large-disassembly', 'kitchen-disassembly', 'Large Kitchen Disassembly (20-25 sqm)', 'Professional disassembly of large kitchen units with careful handling', 900.00, '6-8 hours', 'fixed', 3, true);

-- Cleaning Options
INSERT INTO service_options (id, service_id, title, description, price, duration, pricing_type, unit_price, unit_measure, display_order, is_active) VALUES
('deep-cleaning', 'cleaning', 'Deep Cleaning', 'Comprehensive deep cleaning per square meter including all surfaces, appliances, and fixtures', 6.00, '4-10 hours', 'per_unit', 6.00, 'sqm', 1, true),
('normal-cleaning', 'cleaning', 'Normal Cleaning', 'Standard cleaning per square meter including basic surfaces and fixtures', 5.00, '2-6 hours', 'per_unit', 5.00, 'sqm', 2, true);

-- Furniture Assembly Options
INSERT INTO service_options (id, service_id, title, description, price, duration, pricing_type, display_order, is_active) VALUES
('bed-small-assembly', 'furniture-assembly', 'Small Bed Assembly (Single)', 'Professional assembly of single bed frames, headboards, and footboards', 80.00, '30-45 min', 'fixed', 1, true),
('bed-large-assembly', 'furniture-assembly', 'Large Bed Assembly (King/Queen)', 'Professional assembly of king and queen size bed frames with headboards', 100.00, '45-60 min', 'fixed', 2, true),
('table-small-assembly', 'furniture-assembly', 'Small Table Assembly (4 Sitting)', 'Professional assembly of small dining tables for 4 people', 50.00, '20-30 min', 'fixed', 3, true),
('table-medium-assembly', 'furniture-assembly', 'Medium Table Assembly (6 Sitting)', 'Professional assembly of medium dining tables for 6 people', 70.00, '30-45 min', 'fixed', 4, true),
('table-large-assembly', 'furniture-assembly', 'Large Table Assembly (8+ Sitting)', 'Professional assembly of large dining tables for 8+ people', 100.00, '45-60 min', 'fixed', 5, true),
('wardrobe-small-assembly', 'furniture-assembly', 'Small Wardrobe Assembly (2 doors)', 'Professional assembly of small wardrobes with 2 doors', 80.00, '45-60 min', 'fixed', 6, true),
('wardrobe-large-assembly', 'furniture-assembly', 'Large Wardrobe Assembly (3 doors)', 'Professional assembly of large wardrobes with 3+ doors', 150.00, '60-90 min', 'fixed', 7, true),
('bookshelf-small-assembly', 'furniture-assembly', 'Small Bookshelf Assembly', 'Professional assembly of small bookcases and shelves', 50.00, '30-45 min', 'fixed', 8, true),
('bookshelf-large-assembly', 'furniture-assembly', 'Large Bookshelf Assembly', 'Professional assembly of large bookcases and shelving units', 100.00, '45-75 min', 'fixed', 9, true);

-- Furniture Disassembly Options
INSERT INTO service_options (id, service_id, title, description, price, duration, pricing_type, display_order, is_active) VALUES
('bed-small-disassembly', 'furniture-disassembly', 'Small Bed Disassembly (Single)', 'Professional disassembly of single bed frames with careful handling', 80.00, '30-45 min', 'fixed', 1, true),
('bed-large-disassembly', 'furniture-disassembly', 'Large Bed Disassembly (King/Queen)', 'Professional disassembly of king and queen size bed frames', 100.00, '45-60 min', 'fixed', 2, true),
('table-small-disassembly', 'furniture-disassembly', 'Small Table Disassembly (4 Sitting)', 'Professional disassembly of small dining tables for 4 people', 50.00, '20-30 min', 'fixed', 3, true),
('table-medium-disassembly', 'furniture-disassembly', 'Medium Table Disassembly (6 Sitting)', 'Professional disassembly of medium dining tables for 6 people', 70.00, '30-45 min', 'fixed', 4, true),
('table-large-disassembly', 'furniture-disassembly', 'Large Table Disassembly (8+ Sitting)', 'Professional disassembly of large dining tables for 8+ people', 100.00, '45-60 min', 'fixed', 5, true),
('wardrobe-small-disassembly', 'furniture-disassembly', 'Small Wardrobe Disassembly (2 doors)', 'Professional disassembly of small wardrobes with 2 doors', 80.00, '45-60 min', 'fixed', 6, true),
('wardrobe-large-disassembly', 'furniture-disassembly', 'Large Wardrobe Disassembly (3 doors)', 'Professional disassembly of large wardrobes with 3+ doors', 150.00, '60-90 min', 'fixed', 7, true),
('bookshelf-small-disassembly', 'furniture-disassembly', 'Small Bookshelf Disassembly', 'Professional disassembly of small bookcases and shelves', 50.00, '30-45 min', 'fixed', 8, true),
('bookshelf-large-disassembly', 'furniture-disassembly', 'Large Bookshelf Disassembly', 'Professional disassembly of large bookcases and shelving units', 100.00, '45-75 min', 'fixed', 9, true);

-- Painting Options
INSERT INTO service_options (id, service_id, title, description, price, duration, pricing_type, unit_price, unit_measure, display_order, is_active) VALUES
('ceiling-painting', 'painting', 'Ceiling Painting', 'Professional ceiling painting per square meter with primer and paint', 9.00, '2-4 hours', 'per_unit', 1.00, 'sqm', 1, true),
('interior-painting', 'painting', 'Interior Painting', 'Professional interior painting per square meter with primer and paint', 10.00, '2-4 hours', 'per_unit', 1.00, 'sqm', 2, true),
('exterior-painting', 'painting', 'Exterior Painting', 'Professional exterior painting per square meter with weather-resistant paint', 25.00, '4-8 hours', 'per_unit', 1.00, 'sqm', 3, true);

-- Office Setup Options
INSERT INTO service_options (id, service_id, title, description, price, duration, pricing_type, display_order, is_active) VALUES
('meeting-table-small', 'office-setup', 'Small Meeting Table Setup', 'Professional assembly of small meeting tables for 4-6 people', 80.00, '45-60 min', 'fixed', 1, true),
('meeting-table-large', 'office-setup', 'Large Meeting Table Setup', 'Professional assembly of large meeting tables for 8+ people', 130.00, '1-2 hours', 'fixed', 2, true),
('filing-cabinet-small', 'office-setup', 'Small Filing Cabinet Setup', 'Professional assembly of small filing cabinets with drawers', 50.00, '30-45 min', 'fixed', 3, true),
('filing-cabinet-medium', 'office-setup', 'Medium Filing Cabinet Setup', 'Professional assembly of medium filing cabinets with multiple drawers', 80.00, '45-60 min', 'fixed', 4, true),
('filing-cabinet-large', 'office-setup', 'Large Filing Cabinet Setup', 'Professional assembly of large filing cabinets with extensive storage', 150.00, '60-90 min', 'fixed', 5, true),
('office-desk-small', 'office-setup', 'Small Office Desk Setup (1 person)', 'Professional assembly of small office desk for one person', 60.00, '1-2 hours', 'fixed', 6, true),
('office-desk-medium', 'office-setup', 'Medium Office Desk Setup (4-8 people)', 'Professional assembly of medium office desk for 4-8 people', 110.00, '2-3 hours', 'fixed', 7, true),
('office-desk-large', 'office-setup', 'Large Office Desk Setup (Conference Room)', 'Professional assembly of large office desk or conference room setup', 200.00, '3-4 hours', 'fixed', 8, true),
('office-chair', 'office-setup', 'Office Chair Setup (per chair)', 'Professional assembly of office chairs with all adjustments', 15.00, '15-30 min', 'fixed', 9, true),
('office-bookshelf-small', 'office-setup', 'Small Office Bookshelf Setup', 'Professional assembly of small office bookshelves and storage units', 50.00, '30-45 min', 'fixed', 10, true),
('office-bookshelf-large', 'office-setup', 'Large Office Bookshelf Setup', 'Professional assembly of large office bookshelves and storage systems', 100.00, '45-75 min', 'fixed', 11, true),
('office-equipment', 'office-setup', 'Office Equipment Setup', 'Professional assembly of various office equipment and accessories', 50.00, '1-2 hours', 'fixed', 12, true);

-- =====================================================
-- VERIFICATION QUERIES
-- =====================================================

-- Check updated services
SELECT 'UPDATED SERVICES' as info, id, title, category, pricing_type, unit_measure 
FROM services 
ORDER BY category, title;

-- Check updated service options
SELECT 'UPDATED SERVICE OPTIONS' as info, id, service_id, title, price, pricing_type, unit_price, unit_measure 
FROM service_options 
ORDER BY service_id, price;

-- Summary by category
SELECT 
    'PRICING SUMMARY' as info,
    s.category,
    s.title as service_name,
    COUNT(so.id) as option_count,
    MIN(so.price) as min_price,
    MAX(so.price) as max_price,
    AVG(so.price) as avg_price
FROM services s
LEFT JOIN service_options so ON s.id = so.service_id
GROUP BY s.id, s.title, s.category
ORDER BY s.category, s.title;
