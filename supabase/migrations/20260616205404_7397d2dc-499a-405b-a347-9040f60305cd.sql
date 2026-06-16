-- Explicitly remove all privileges from the anon role on estimate_requests.
-- Public form submissions go through the /api/public/submit-quote server endpoint
-- which uses the service role key (bypasses RLS), so anon never touches this table.
REVOKE ALL ON public.estimate_requests FROM anon;

-- Admin management policies so only admins can edit or delete submissions.
CREATE POLICY "Admins can update estimate requests"
ON public.estimate_requests FOR UPDATE TO authenticated
USING (public.has_role(auth.uid(), 'admin'))
WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete estimate requests"
ON public.estimate_requests FOR DELETE TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

-- Note: no INSERT policy for anon or authenticated. Inserts are only allowed
-- via service_role (the server endpoint), which bypasses RLS.