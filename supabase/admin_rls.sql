-- Allow authenticated users to insert/update/delete team_members
CREATE POLICY "Authenticated users can insert team_members" ON team_members FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Authenticated users can update team_members" ON team_members FOR UPDATE TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Authenticated users can delete team_members" ON team_members FOR DELETE TO authenticated USING (true);

-- Allow authenticated users to insert/update/delete projects
CREATE POLICY "Authenticated users can insert projects" ON projects FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Authenticated users can update projects" ON projects FOR UPDATE TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Authenticated users can delete projects" ON projects FOR DELETE TO authenticated USING (true);

-- Allow authenticated users to insert/update/delete events
CREATE POLICY "Authenticated users can insert events" ON events FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Authenticated users can update events" ON events FOR UPDATE TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Authenticated users can delete events" ON events FOR DELETE TO authenticated USING (true);

-- Setup Storage Policies
-- Assuming buckets 'team', 'projects', 'events' exist and are public.
-- If they are not created, run:
-- insert into storage.buckets (id, name, public) values ('team', 'team', true);
-- insert into storage.buckets (id, name, public) values ('projects', 'projects', true);
-- insert into storage.buckets (id, name, public) values ('events', 'events', true);

-- Public read access to buckets
CREATE POLICY "Public Access" ON storage.objects FOR SELECT USING (bucket_id IN ('team', 'projects', 'events'));

-- Authenticated upload access
CREATE POLICY "Admin Upload Access" ON storage.objects FOR INSERT TO authenticated WITH CHECK (bucket_id IN ('team', 'projects', 'events'));

-- Authenticated update access
CREATE POLICY "Admin Update Access" ON storage.objects FOR UPDATE TO authenticated USING (bucket_id IN ('team', 'projects', 'events')) WITH CHECK (bucket_id IN ('team', 'projects', 'events'));

-- Authenticated delete access
CREATE POLICY "Admin Delete Access" ON storage.objects FOR DELETE TO authenticated USING (bucket_id IN ('team', 'projects', 'events'));
