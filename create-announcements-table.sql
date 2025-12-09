-- Add announcements table to Supabase
-- Run this in Supabase SQL Editor

CREATE TABLE announcements (
  id SERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  author TEXT NOT NULL,
  priority TEXT DEFAULT 'normal',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Insert sample announcement
INSERT INTO announcements (title, content, author, priority) VALUES
  ('Welcome to Admin Panel', 'This is the new admin panel for managing team activities and communications.', 'Admin', 'high');
