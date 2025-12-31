-- Add missing columns to users table
ALTER TABLE users ADD COLUMN IF NOT EXISTS name VARCHAR(255);
ALTER TABLE users ADD COLUMN IF NOT EXISTS business_name VARCHAR(255);

-- Update RLS policy to allow updates
CREATE POLICY "Users can update own name and business" ON users
    FOR UPDATE USING (auth.uid() = id);