-- Remove summary and advice_items columns from users table
DROP INDEX IF EXISTS idx_users_advice_items;
ALTER TABLE users DROP COLUMN IF EXISTS advice_items;
ALTER TABLE users DROP COLUMN IF EXISTS summary;
