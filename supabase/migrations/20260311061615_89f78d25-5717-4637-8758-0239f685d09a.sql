CREATE POLICY "Users can read own purchases"
  ON public.purchases
  FOR SELECT
  TO authenticated
  USING (user_id = auth.uid()::text);