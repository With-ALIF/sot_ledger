-- SOT Payment Management System - Database Schema
-- This file contains the SQL queries to set up the database in Supabase.

-- 1. Create the 'payments' table
CREATE TABLE IF NOT EXISTS payments (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    amount DECIMAL(12, 2) NOT NULL,
    method TEXT NOT NULL CHECK (method IN ('Bkash', 'Nagad', 'Rocket', 'Bank', 'Other')),
    phone_number TEXT NOT NULL,
    message TEXT,
    partner TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Create the 'admin_access' table for authentication
CREATE TABLE IF NOT EXISTS admin_access (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    email TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Create the 'partner_tasks' table
CREATE TABLE IF NOT EXISTS partner_tasks (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    category TEXT NOT NULL,
    sub_category TEXT NOT NULL,
    percentage DECIMAL(5, 2) NOT NULL,
    partner_name TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Enable Row Level Security (RLS) on tables
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_access ENABLE ROW LEVEL SECURITY;
ALTER TABLE partner_tasks ENABLE ROW LEVEL SECURITY;

-- 5. Create Policies for 'payments' table
-- Allow public read access
CREATE POLICY "Allow public read access" 
ON payments FOR SELECT 
USING (true);

-- Allow public insert access
CREATE POLICY "Allow public insert access" 
ON payments FOR INSERT 
WITH CHECK (true);

-- Allow public delete access
CREATE POLICY "Allow public delete access" 
ON payments FOR DELETE 
USING (true);

-- 6. Create Policies for 'admin_access' table
-- Allow public read access (Required for login check)
CREATE POLICY "Allow public read access" 
ON admin_access FOR SELECT 
USING (true);

-- 7. Create Policies for 'partner_tasks' table
CREATE POLICY "Allow public read access" 
ON partner_tasks FOR SELECT 
USING (true);

CREATE POLICY "Allow public insert access" 
ON partner_tasks FOR INSERT 
WITH CHECK (true);

CREATE POLICY "Allow public update access" 
ON partner_tasks FOR UPDATE 
USING (true);

CREATE POLICY "Allow public delete access" 
ON partner_tasks FOR DELETE 
USING (true);

-- 8. Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_payments_phone_number ON payments(phone_number);
CREATE INDEX IF NOT EXISTS idx_payments_created_at ON payments(created_at DESC);

-- 9. Insert a default admin user (Change this immediately!)
INSERT INTO admin_access (email, password) 
VALUES ('admin@example.com', 'admin123')
ON CONFLICT (email) DO NOTHING;

-- 10. Insert default tasks
INSERT INTO partner_tasks (category, sub_category, percentage) 
VALUES 
    ('Question Maker', 'Physics', 15),
    ('Question Maker', 'Chemistry', 15),
    ('Question Maker', 'Biology', 15),
    ('Question Maker', 'Math', 21),
    ('QB Maker', 'Physics', 6),
    ('QB Maker', 'Chemistry', 6),
    ('QB Maker', 'Biology', 6),
    ('QB Maker', 'Math', 6),
    ('Management', 'General', 10)
ON CONFLICT DO NOTHING;

create table app_settings (
  id uuid default uuid_generate_v4() primary key,
  telegram_bot_token text,
  telegram_channel_id text,
  updated_at timestamp with time zone default timezone('utc'::text, now())
);

-- প্রাথমিক একটি রো ইনসার্ট করুন
insert into app_settings (telegram_bot_token, telegram_channel_id) values ('', '');

-- 11. Create 'courses' table
CREATE TABLE IF NOT EXISTS courses (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL,
    logo_url TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 12. Add course_id to payments table
ALTER TABLE payments ADD COLUMN IF NOT EXISTS course_id UUID REFERENCES courses(id);

-- 13. Enable RLS for courses
ALTER TABLE courses ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read access" 
ON courses FOR SELECT 
USING (true);

CREATE POLICY "Allow public insert access" 
ON courses FOR INSERT 
WITH CHECK (true);

CREATE POLICY "Allow public update access" 
ON courses FOR UPDATE 
USING (true);

CREATE POLICY "Allow public delete access" 
ON courses FOR DELETE 
USING (true);
