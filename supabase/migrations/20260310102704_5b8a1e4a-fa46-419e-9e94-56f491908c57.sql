
-- Fix the trigger version of unlock_premium to have a fixed search_path
CREATE OR REPLACE FUNCTION public.unlock_premium()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public', 'pg_temp'
AS $function$
begin
  update users
  set premium = true
  where id = new.user_id;

  return new;
end;
$function$;
