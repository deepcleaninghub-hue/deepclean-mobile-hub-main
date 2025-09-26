-- Add address column to mobile_users table
-- This script adds the address column to make it required for user signup

-- Add address column to mobile_users table
ALTER TABLE mobile_users 
ADD COLUMN IF NOT EXISTS address TEXT;

-- Update existing users with a default address if they don't have one
UPDATE mobile_users 
SET address = 'Address not provided' 
WHERE address IS NULL OR address = '';

-- Make address column NOT NULL after updating existing records
ALTER TABLE mobile_users 
ALTER COLUMN address SET NOT NULL;

-- Add a check constraint to ensure address is not empty
ALTER TABLE mobile_users 
ADD CONSTRAINT check_address_not_empty 
CHECK (LENGTH(TRIM(address)) > 0);

-- Add an index on address for better query performance
CREATE INDEX IF NOT EXISTS idx_mobile_users_address 
ON mobile_users(address);

-- Verify the changes
SELECT column_name, data_type, is_nullable, column_default
FROM information_schema.columns 
WHERE table_name = 'mobile_users' 
AND column_name = 'address';
