-- Remove advice_items column from company_es table
DROP INDEX IF EXISTS idx_company_es_advice_items;
ALTER TABLE company_es DROP COLUMN IF EXISTS advice_items;
