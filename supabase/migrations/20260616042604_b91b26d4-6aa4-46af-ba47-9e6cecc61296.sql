
CREATE TABLE public.estimate_requests (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  phone TEXT NOT NULL,
  service TEXT,
  details TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

GRANT INSERT ON public.estimate_requests TO anon, authenticated;
GRANT ALL ON public.estimate_requests TO service_role;

ALTER TABLE public.estimate_requests ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can submit an estimate request"
  ON public.estimate_requests FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);
