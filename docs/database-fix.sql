-- Alternative Database Setup for Backend Service Key Authentication
-- Run this if you're having RLS issues with the service key

-- First, let's create the table without RLS for testing
DROP TABLE IF EXISTS campaigns CASCADE;

-- Create campaigns table
CREATE TABLE campaigns (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL, -- Removed foreign key constraint for now
    title VARCHAR(200) NOT NULL,
    description TEXT NOT NULL,
    target_audience VARCHAR(500) NOT NULL,
    campaign_type VARCHAR(20) NOT NULL CHECK (campaign_type IN ('email', 'social', 'web', 'print')),
    content TEXT DEFAULT '',
    status VARCHAR(20) DEFAULT 'draft' CHECK (status IN ('draft', 'active', 'completed', 'paused')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX idx_campaigns_user_id ON campaigns(user_id);
CREATE INDEX idx_campaigns_status ON campaigns(status);
CREATE INDEX idx_campaigns_created_at ON campaigns(created_at DESC);

-- Create function to automatically update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger for auto-updating updated_at
CREATE TRIGGER update_campaigns_updated_at
    BEFORE UPDATE ON campaigns
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- For now, we'll NOT enable RLS since we're using service key
-- This allows the backend to work immediately
-- In production, you'd want to implement proper RLS policies

-- Test insert to verify it works
-- INSERT INTO campaigns (user_id, title, description, target_audience, campaign_type) 
-- VALUES ('12345678-1234-1234-1234-123456789012', 'Test Campaign', 'Test Description', 'Test Audience', 'email');
