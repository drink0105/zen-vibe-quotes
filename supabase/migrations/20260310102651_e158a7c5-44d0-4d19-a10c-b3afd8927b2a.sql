
-- 1. Revoke anon/public execute on unlock_premium functions
REVOKE EXECUTE ON FUNCTION public.unlock_premium(uuid) FROM anon, public, authenticated;

-- 2. Add role guard inside unlock_premium(uuid) function
CREATE OR REPLACE FUNCTION public.unlock_premium(user_id uuid)
 RETURNS void
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public', 'pg_temp'
AS $function$
BEGIN
  -- Only allow service_role to call this function
  IF current_setting('request.jwt.claim.role', true) IS DISTINCT FROM 'service_role' THEN
    RAISE EXCEPTION 'Unauthorized: only service_role can call this function';
  END IF;

  UPDATE public.users
  SET premium = true
  WHERE id = user_id
  AND premium IS NOT TRUE;
END;
$function$;

-- 3. Drop the overly permissive INSERT policy
DROP POLICY IF EXISTS "Enable insert access for all users" ON public.users;

-- 4. Create new INSERT policy scoped to auth.uid()
CREATE POLICY "Users can insert own row"
  ON public.users
  FOR INSERT
  TO authenticated
  WITH CHECK (id = auth.uid());

-- 5. Update SELECT policy to be scoped to own row
DROP POLICY IF EXISTS "Enable read access for all users" ON public.users;

CREATE POLICY "Users can read own row"
  ON public.users
  FOR SELECT
  TO authenticated
  USING (id = auth.uid());

-- 6. Enable RLS on purchases table
ALTER TABLE public.purchases ENABLE ROW LEVEL SECURITY;

-- 7. Restrict purchases to own user
CREATE POLICY "Service role only inserts purchases"
  ON public.purchases
  FOR INSERT
  TO authenticated
  WITH CHECK (false);
