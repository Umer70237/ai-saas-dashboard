import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL = 'https://zibqscmpgeaduovxiyep.supabase.co'
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InppYnFzY21wZ2VhZHVvdnhpeWVwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzg1ODk1MDksImV4cCI6MjA5NDE2NTUwOX0.JuMSswHbJjxsojCtgpMjvvKyIZFO1pf_Jgqyo8qRJto'

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY)



