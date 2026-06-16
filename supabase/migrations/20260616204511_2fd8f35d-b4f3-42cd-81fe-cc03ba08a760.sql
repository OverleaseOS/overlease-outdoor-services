-- Roles enum + table
CREATE TYPE public.app_role AS ENUM ('admin');

CREATE TABLE public.user_roles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role public.app_role NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (user_id, role)
);

GRANT SELECT ON public.user_roles TO authenticated;
GRANT ALL ON public.user_roles TO service_role;

ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own roles"
ON public.user_roles FOR SELECT TO authenticated
USING (auth.uid() = user_id);

-- Security-definer role check (avoids RLS recursion)
CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role public.app_role)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = _user_id AND role = _role
  )
$$;

-- Auto-grant admin to the owner email on signup
CREATE OR REPLACE FUNCTION public.handle_new_user_admin_grant()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF lower(NEW.email) = 'info@overleaseoutdoorservices.com' THEN
    INSERT INTO public.user_roles (user_id, role)
    VALUES (NEW.id, 'admin')
    ON CONFLICT (user_id, role) DO NOTHING;
  END IF;
  RETURN NEW;
END;
$$;

CREATE TRIGGER on_auth_user_created_admin_grant
AFTER INSERT ON auth.users
FOR EACH ROW EXECUTE FUNCTION public.handle_new_user_admin_grant();

-- Lock down estimate_requests: enable RLS, grant admins read access
GRANT SELECT ON public.estimate_requests TO authenticated;
GRANT ALL ON public.estimate_requests TO service_role;

ALTER TABLE public.estimate_requests ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can view estimate requests"
ON public.estimate_requests FOR SELECT TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

-- Admin player IDs for OneSignal push targeting
CREATE TABLE public.admin_push_subscriptions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  player_id text NOT NULL UNIQUE,
  created_at timestamptz NOT NULL DEFAULT now()
);

GRANT SELECT, INSERT, DELETE ON public.admin_push_subscriptions TO authenticated;
GRANT ALL ON public.admin_push_subscriptions TO service_role;

ALTER TABLE public.admin_push_subscriptions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can view push subs"
ON public.admin_push_subscriptions FOR SELECT TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can register push subs"
ON public.admin_push_subscriptions FOR INSERT TO authenticated
WITH CHECK (public.has_role(auth.uid(), 'admin') AND auth.uid() = user_id);

CREATE POLICY "Admins can delete their push subs"
ON public.admin_push_subscriptions FOR DELETE TO authenticated
USING (public.has_role(auth.uid(), 'admin') AND auth.uid() = user_id);