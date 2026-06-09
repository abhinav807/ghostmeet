CREATE TABLE meetings (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  file_name TEXT NOT NULL,
  file_size BIGINT NOT NULL DEFAULT 0,
  file_type TEXT NOT NULL DEFAULT '',
  duration INTEGER NOT NULL DEFAULT 0,
  status TEXT NOT NULL DEFAULT 'uploading' CHECK (status IN ('uploading', 'transcribing', 'generating', 'completed', 'error')),
  transcript TEXT NOT NULL DEFAULT '',
  summary TEXT NOT NULL DEFAULT '',
  key_decisions JSONB NOT NULL DEFAULT '[]',
  action_items JSONB NOT NULL DEFAULT '[]',
  follow_up_email TEXT NOT NULL DEFAULT '',
  meeting_minutes TEXT NOT NULL DEFAULT '',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE meetings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "select_own_meetings" ON meetings FOR SELECT
  TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "insert_own_meetings" ON meetings FOR INSERT
  TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "update_own_meetings" ON meetings FOR UPDATE
  TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE POLICY "delete_own_meetings" ON meetings FOR DELETE
  TO authenticated USING (auth.uid() = user_id);

CREATE INDEX idx_meetings_user_id ON meetings(user_id);
CREATE INDEX idx_meetings_status ON meetings(status);
CREATE INDEX idx_meetings_created_at ON meetings(created_at DESC);
