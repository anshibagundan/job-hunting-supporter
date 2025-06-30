CREATE TABLE IF NOT EXISTS company_es (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES users(id),
    company_id INTEGER NOT NULL REFERENCES companies(id),
    title VARCHAR(255) NOT NULL DEFAULT '',
    content TEXT NOT NULL,
    ai_summary TEXT,
    ai_advice TEXT,
    advice_items JSONB,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_company_es_advice_items ON company_es USING GIN (advice_items);