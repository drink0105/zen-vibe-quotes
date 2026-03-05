import { createClient } from '@supabase/supabase-js'

const supabaseUrl = "https://ghmjtkzrjddfdjautcfb.supabase.co"
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdobWp0a3pyamRkZmRqYXV0Y2ZiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzI2ODg5MjIsImV4cCI6MjA4ODI2NDkyMn0.CQVpuaTr33INuL9MBHZgiAem99pXrt07FG_bC-_utXI"

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
