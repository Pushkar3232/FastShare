const { Client } = require("pg");

const DATABASE_URL = `postgresql://postgres:Pushk%40r141Supa@db.ceszkugssgzglavtyfpd.supabase.co:5432/postgres`;

const SQL = `
-- Create storage bucket
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'rooms-storage',
  'rooms-storage',
  false,
  10485760,
  ARRAY['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'application/pdf']
)
ON CONFLICT (id) DO UPDATE SET
  public = false,
  file_size_limit = 10485760,
  allowed_mime_types = ARRAY['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'application/pdf'];

-- Storage policy: allow anon users to upload
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Allow public uploads' AND tablename = 'objects') THEN
    CREATE POLICY "Allow public uploads" ON storage.objects FOR INSERT TO anon, authenticated WITH CHECK (bucket_id = 'rooms-storage');
  END IF;
END $$;

-- Storage policy: allow reading objects  
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Allow public reads' AND tablename = 'objects') THEN
    CREATE POLICY "Allow public reads" ON storage.objects FOR SELECT TO anon, authenticated USING (bucket_id = 'rooms-storage');
  END IF;
END $$;

-- Storage policy: allow deleting objects
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Allow public deletes' AND tablename = 'objects') THEN
    CREATE POLICY "Allow public deletes" ON storage.objects FOR DELETE TO anon, authenticated USING (bucket_id = 'rooms-storage');
  END IF;
END $$;
`;

async function setup() {
  const client = new Client({ connectionString: DATABASE_URL });
  try {
    console.log("Connecting to Supabase database...");
    await client.connect();
    console.log("Connected. Setting up storage...");
    await client.query(SQL);
    console.log("✓ Storage bucket 'rooms-storage' created!");
    console.log("✓ Storage policies set!");
  } catch (err) {
    console.error("Error:", err.message);
  } finally {
    await client.end();
  }
}

setup();
