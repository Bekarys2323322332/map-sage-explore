-- Create visitors table to track total unique visitors
CREATE TABLE IF NOT EXISTS public.visitors (
  id INTEGER PRIMARY KEY DEFAULT 1,
  count INTEGER NOT NULL DEFAULT 0,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert initial row
INSERT INTO public.visitors (id, count) VALUES (1, 0)
ON CONFLICT (id) DO NOTHING;

-- No RLS needed - we'll handle access through edge function
ALTER TABLE public.visitors ENABLE ROW LEVEL SECURITY;

-- Allow edge function to update the count (service role will handle this)
CREATE POLICY "Allow service role to update visitors"
ON public.visitors
FOR ALL
TO service_role
USING (true)
WITH CHECK (true);