CREATE TABLE IF NOT EXISTS interviews (
    id SERIAL PRIMARY KEY,
    company_id INTEGER NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
    job_event_id INTEGER NOT NULL REFERENCES job_events(id) ON DELETE CASCADE,
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    interview_at TIMESTAMP NOT NULL,
    stage VARCHAR(255) NOT NULL,

    audio_note_path TEXT,
    transcript TEXT,
    audio_summary TEXT,
    text_note TEXT,

    location TEXT,
    meeting_url TEXT,

    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

