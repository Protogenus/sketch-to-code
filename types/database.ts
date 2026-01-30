export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string
          clerk_id: string
          email: string
          credits: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          clerk_id: string
          email: string
          credits?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          clerk_id?: string
          email?: string
          credits?: number
          created_at?: string
          updated_at?: string
        }
      }
      conversions: {
        Row: {
          id: string
          user_id: string
          image_url: string
          generated_code: string
          format: string
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          image_url: string
          generated_code: string
          format: string
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          image_url?: string
          generated_code?: string
          format?: string
          created_at?: string
        }
      }
      purchases: {
        Row: {
          id: string
          user_id: string
          stripe_session_id: string
          credits_purchased: number
          amount_paid: number
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          stripe_session_id: string
          credits_purchased: number
          amount_paid: number
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          stripe_session_id?: string
          credits_purchased?: number
          amount_paid?: number
          created_at?: string
        }
      }
    }
  }
}
