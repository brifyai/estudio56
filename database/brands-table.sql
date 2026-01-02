-- Create brands table for storing brand/marketing information
CREATE TABLE IF NOT EXISTS brands (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    is_default BOOLEAN NOT NULL DEFAULT false,
    website_url TEXT,
    instagram VARCHAR(100),
    tiktok VARCHAR(100),
    facebook VARCHAR(255),
    primary_color VARCHAR(20) DEFAULT '#000000',
    secondary_color VARCHAR(20) DEFAULT '#FFFFFF',
    industry VARCHAR(100),
    notification_settings JSONB DEFAULT '{"enabled": false, "daysBeforeEvent": [7, 3, 1]}'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_brands_user_id ON brands(user_id);
CREATE INDEX IF NOT EXISTS idx_brands_is_default ON brands(user_id, is_default);

-- Enable RLS for brands table
ALTER TABLE IF EXISTS brands ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for brands (use OR REPLACE if exists)
DROP POLICY IF EXISTS "Users can view own brands" ON brands;
CREATE POLICY "Users can view own brands" ON brands
    FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can create own brands" ON brands;
CREATE POLICY "Users can create own brands" ON brands
    FOR INSERT WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update own brands" ON brands;
CREATE POLICY "Users can update own brands" ON brands
    FOR UPDATE USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can delete own brands" ON brands;
CREATE POLICY "Users can delete own brands" ON brands
    FOR DELETE USING (auth.uid() = user_id);