-- Row Level Security (RLS) の有効化
ALTER TABLE events ENABLE ROW LEVEL SECURITY;
ALTER TABLE es_entries ENABLE ROW LEVEL SECURITY;
ALTER TABLE interview_entries ENABLE ROW LEVEL SECURITY;

-- ユーザーは自分のデータのみアクセス可能
CREATE POLICY "Users can view own events" ON events
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own events" ON events
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own events" ON events
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own events" ON events
  FOR DELETE USING (auth.uid() = user_id);

-- ES entries policies
CREATE POLICY "Users can view own es_entries" ON es_entries
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own es_entries" ON es_entries
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own es_entries" ON es_entries
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own es_entries" ON es_entries
  FOR DELETE USING (auth.uid() = user_id);

-- Interview entries policies
CREATE POLICY "Users can view own interview_entries" ON interview_entries
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own interview_entries" ON interview_entries
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own interview_entries" ON interview_entries
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own interview_entries" ON interview_entries
  FOR DELETE USING (auth.uid() = user_id);
