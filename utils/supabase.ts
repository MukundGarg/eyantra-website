import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

console.log("Supabase URL configured:", !!process.env.NEXT_PUBLIC_SUPABASE_URL)
console.log("Supabase key configured:", !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY)

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
