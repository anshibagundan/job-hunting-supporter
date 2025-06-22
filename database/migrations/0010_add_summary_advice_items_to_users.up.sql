-- Add summary and advice_items columns to users table for storing base ES analysis results
ALTER TABLE users ADD COLUMN summary TEXT;
ALTER TABLE users ADD COLUMN advice_items JSONB;

-- Add index for JSONB operations
CREATE INDEX IF NOT EXISTS idx_users_advice_items ON users USING GIN (advice_items);
