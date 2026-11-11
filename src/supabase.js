import { createClient } from '@supabase/supabase-js'

// The publishable key is meant to be public; the database's row-level security
// rules (supabase/schema.sql) decide what it can do. Never put a secret key here.
const url = import.meta.env.VITE_SUPABASE_URL || 'https://hiystakoxrnbuhcyrvjt.supabase.co'
const key = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY || 'sb_publishable_0wbZmqyP8O2qe2xkpMjdog_DTmmBDa-'

export const supabase = createClient(url, key)
