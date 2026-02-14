const { Client } = require("pg");

const DATABASE_URL = `postgresql://postgres:Pushk%40r141Supa@db.ceszkugssgzglavtyfpd.supabase.co:5432/postgres`;

const SQL = `
-- Create rooms table
CREATE TABLE IF NOT EXISTS public.rooms (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  room_code text NOT NULL UNIQUE,
  created_at timestamptz NOT NULL DEFAULT now(),
  expires_at timestamptz NOT NULL
);

-- Create files table
CREATE TABLE IF NOT EXISTS public.files (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  room_id uuid NOT NULL REFERENCES public.rooms(id) ON DELETE CASCADE,
  file_name text NOT NULL,
  file_path text NOT NULL,
  uploaded_at timestamptz NOT NULL DEFAULT now()
);

-- Create index for fast room code lookups
CREATE INDEX IF NOT EXISTS idx_rooms_room_code ON public.rooms(room_code);

-- Create index for fast file lookups by room
CREATE INDEX IF NOT EXISTS idx_files_room_id ON public.files(room_id);

-- Create index for finding expired rooms
CREATE INDEX IF NOT EXISTS idx_rooms_expires_at ON public.rooms(expires_at);

-- Enable Row Level Security (but allow all for anon key — public app)
ALTER TABLE public.rooms ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.files ENABLE ROW LEVEL SECURITY;

-- Policy: allow all operations for anon users (public app, no login)
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Allow all on rooms') THEN
    CREATE POLICY "Allow all on rooms" ON public.rooms FOR ALL USING (true) WITH CHECK (true);
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Allow all on files') THEN
    CREATE POLICY "Allow all on files" ON public.files FOR ALL USING (true) WITH CHECK (true);
  END IF;
END $$;
`;

async function setup() {
  const client = new Client({ connectionString: DATABASE_URL });
  try {
    console.log("Connecting to Supabase database...");
    await client.connect();
    console.log("Connected. Running migrations...");
    await client.query(SQL);
    console.log("✓ Tables created successfully!");
    console.log("  - public.rooms");
    console.log("  - public.files");
    console.log("  - Indexes created");
    console.log("  - RLS policies set");
  } catch (err) {
    console.error("Error:", err.message);
  } finally {
    await client.end();
  }
}

setup();
