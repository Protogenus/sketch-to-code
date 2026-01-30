import { createClient } from '@supabase/supabase-js'
import { Database } from '@/types/database'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey)

export const supabaseAdmin = createClient<Database>(
  supabaseUrl,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  }
)

export async function getOrCreateUser(clerkUserId: string, email: string) {
  const { data: existingUser } = await supabaseAdmin
    .from('users')
    .select('*')
    .eq('clerk_id', clerkUserId)
    .single()

  if (existingUser) {
    return existingUser
  }

  const { data: newUser, error } = await supabaseAdmin
    .from('users')
    .insert({
      clerk_id: clerkUserId,
      email,
      credits: 2,
    })
    .select()
    .single()

  if (error) throw error
  return newUser
}

export async function getUserCredits(clerkUserId: string): Promise<number> {
  const { data } = await supabaseAdmin
    .from('users')
    .select('credits')
    .eq('clerk_id', clerkUserId)
    .single()

  return data?.credits ?? 0
}

export async function deductCredit(clerkUserId: string): Promise<boolean> {
  const { data: user } = await supabaseAdmin
    .from('users')
    .select('credits')
    .eq('clerk_id', clerkUserId)
    .single()

  if (!user || user.credits < 1) {
    return false
  }

  const { error } = await supabaseAdmin
    .from('users')
    .update({ credits: user.credits - 1 })
    .eq('clerk_id', clerkUserId)

  return !error
}

export async function addCredits(clerkUserId: string, amount: number): Promise<boolean> {
  const { data: user } = await supabaseAdmin
    .from('users')
    .select('credits')
    .eq('clerk_id', clerkUserId)
    .single()

  if (!user) return false

  const { error } = await supabaseAdmin
    .from('users')
    .update({ credits: user.credits + amount })
    .eq('clerk_id', clerkUserId)

  return !error
}

export async function saveConversion(
  clerkUserId: string,
  imageUrl: string,
  generatedCode: string,
  format: string
) {
  const { data, error } = await supabaseAdmin
    .from('conversions')
    .insert({
      user_id: clerkUserId,
      image_url: imageUrl,
      generated_code: generatedCode,
      format,
    })
    .select()
    .single()

  if (error) throw error
  return data
}

export async function getConversionHistory(clerkUserId: string) {
  const { data, error } = await supabaseAdmin
    .from('conversions')
    .select('*')
    .eq('user_id', clerkUserId)
    .order('created_at', { ascending: false })
    .limit(50)

  if (error) throw error
  return data
}
