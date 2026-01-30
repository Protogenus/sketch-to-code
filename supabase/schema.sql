-- SketchToCode Database Schema
-- Run this in your Supabase SQL Editor

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users table
CREATE TABLE IF NOT EXISTS users (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  clerk_id TEXT UNIQUE NOT NULL,
  email TEXT NOT NULL,
  credits INTEGER DEFAULT 2 NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index for faster lookups
CREATE INDEX IF NOT EXISTS idx_users_clerk_id ON users(clerk_id);

-- Conversions table (stores conversion history)
CREATE TABLE IF NOT EXISTS conversions (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id TEXT NOT NULL,
  image_url TEXT,
  generated_code TEXT NOT NULL,
  format TEXT DEFAULT 'html',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index for user lookups
CREATE INDEX IF NOT EXISTS idx_conversions_user_id ON conversions(user_id);
CREATE INDEX IF NOT EXISTS idx_conversions_created_at ON conversions(created_at DESC);

-- Purchases table (tracks all credit purchases)
CREATE TABLE IF NOT EXISTS purchases (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id TEXT NOT NULL,
  stripe_session_id TEXT UNIQUE NOT NULL,
  credits_purchased INTEGER NOT NULL,
  amount_paid DECIMAL(10, 2) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index for user purchases
CREATE INDEX IF NOT EXISTS idx_purchases_user_id ON purchases(user_id);

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger to auto-update updated_at on users table
DROP TRIGGER IF EXISTS update_users_updated_at ON users;
CREATE TRIGGER update_users_updated_at
  BEFORE UPDATE ON users
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Row Level Security (RLS) Policies
-- Enable RLS on all tables
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE conversions ENABLE ROW LEVEL SECURITY;
ALTER TABLE purchases ENABLE ROW LEVEL SECURITY;

-- Policy: Users can only see their own data (for authenticated users via Supabase Auth)
-- Note: Since we use Clerk for auth and service role key for DB access, 
-- these policies are mostly for direct Supabase access if needed

-- Allow service role full access (for our API)
CREATE POLICY "Service role has full access to users" ON users
  FOR ALL USING (true);

CREATE POLICY "Service role has full access to conversions" ON conversions
  FOR ALL USING (true);

CREATE POLICY "Service role has full access to purchases" ON purchases
  FOR ALL USING (true);

-- Sample data for testing (optional - comment out in production)
-- INSERT INTO users (clerk_id, email, credits)
-- VALUES ('user_test123', 'test@example.com', 5);
