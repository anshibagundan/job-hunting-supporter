-- Add advice_items column to company_es table to store structured AI analysis results
ALTER TABLE company_es ADD COLUMN advice_items JSONB;

-- Add index for JSONB operations
CREATE INDEX IF NOT EXISTS idx_company_es_advice_items ON company_es USING GIN (advice_items);
