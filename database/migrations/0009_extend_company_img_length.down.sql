-- Revert company img column back to VARCHAR(255)
ALTER TABLE companies ALTER COLUMN img TYPE VARCHAR(255);
