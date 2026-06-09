-- Drop authenticated-only policies and replace with public policies
-- since there is no auth flow yet

DROP POLICY IF EXISTS "select_own_meetings" ON meetings;
DROP POLICY IF EXISTS "insert_own_meetings" ON meetings;
DROP POLICY IF EXISTS "update_own_meetings" ON meetings;
DROP POLICY IF EXISTS "delete_own_meetings" ON meetings;

-- Allow all CRUD for anon + authenticated (no auth flow in place yet)
CREATE POLICY "select_meetings" ON meetings FOR SELECT
  TO anon, authenticated USING (true);
CREATE POLICY "insert_meetings" ON meetings FOR INSERT
  TO anon, authenticated WITH CHECK (true);
CREATE POLICY "update_meetings" ON meetings FOR UPDATE
  TO anon, authenticated USING (true) WITH CHECK (true);
CREATE POLICY "delete_meetings" ON meetings FOR DELETE
  TO anon, authenticated USING (true);
