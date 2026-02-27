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
      sessions: {
        Row: {
          id: string
          code: string
          offer: Json | null
          answer: Json | null
          sender_ice_candidates: Json
          receiver_ice_candidates: Json
          status: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          code: string
          offer?: Json | null
          answer?: Json | null
          sender_ice_candidates?: Json
          receiver_ice_candidates?: Json
          status?: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          code?: string
          offer?: Json | null
          answer?: Json | null
          sender_ice_candidates?: Json
          receiver_ice_candidates?: Json
          status?: string
          created_at?: string
          updated_at?: string
        }
      }
    }
  }
}
