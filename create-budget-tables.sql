-- Create table for storing the total budget setting
-- This table will likely just have one row, but allows for historical records if needed
CREATE TABLE IF NOT EXISTS budget_settings (
    id SERIAL PRIMARY KEY,
    total_amount NUMERIC(12, 2) NOT NULL DEFAULT 0,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_by TEXT -- Stores who last updated the total budget
);

-- Insert an initial row if empty
INSERT INTO budget_settings (total_amount, updated_at, updated_by)
SELECT 0, CURRENT_TIMESTAMP, 'System'
WHERE NOT EXISTS (SELECT 1 FROM budget_settings);

-- Create table for forums and their allocated budgets
CREATE TABLE IF NOT EXISTS forum_budgets (
    id SERIAL PRIMARY KEY,
    forum_name TEXT NOT NULL UNIQUE,
    allocated_amount NUMERIC(12, 2) NOT NULL DEFAULT 0,
    spent_amount NUMERIC(12, 2) NOT NULL DEFAULT 0, -- Optional: Track spending against allocation
    last_updated TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Pre-populate with some common forums (or ensure they exist)
INSERT INTO forum_budgets (forum_name, allocated_amount)
VALUES 
    ('Technical Forum', 0),
    ('Cultural Forum', 0),
    ('Sports Forum', 0),
    ('Literary Forum', 0)
ON CONFLICT (forum_name) DO NOTHING;

-- Enable Row Level Security (RLS) is generally good practice in Supabase
ALTER TABLE budget_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE forum_budgets ENABLE ROW LEVEL SECURITY;

-- Create policies (open access for now as roles are handled in API, but ideally restricted)
-- For simplicity in this SQL script, we are enabling broad access but typically you'd restrict WRITE
CREATE POLICY "Enable read/write for budget_settings" ON budget_settings FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Enable read/write for forum_budgets" ON forum_budgets FOR ALL USING (true) WITH CHECK (true);
