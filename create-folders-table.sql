-- Create folders table for organizing files
CREATE TABLE folders (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  color TEXT DEFAULT '#3B82F6',
  parent_id INTEGER REFERENCES folders(id) ON DELETE CASCADE,
  created_by TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Add folder_id column to files table
ALTER TABLE files ADD COLUMN folder_id INTEGER REFERENCES folders(id) ON DELETE SET NULL;

-- Create index for faster queries
CREATE INDEX idx_files_folder_id ON files(folder_id);
CREATE INDEX idx_folders_parent_id ON folders(parent_id);
