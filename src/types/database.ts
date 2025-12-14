export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type PricingModel = 'free' | 'freemium' | 'paid' | 'enterprise' | 'open_source'
export type ToolStatus = 'active' | 'pending' | 'archived'
export type DealType = 'ltd' | 'discount' | 'coupon' | 'trial' | 'free'
export type DealSource = 'appsumo' | 'stacksocial' | 'pitchground' | 'direct' | 'user'
export type DigestFrequency = 'daily' | 'weekly' | 'never'

export interface Database {
  public: {
    Tables: {
      categories: {
        Row: {
          id: string
          slug: string
          name: string
          description: string | null
          icon: string | null
          parent_id: string | null
          display_order: number
          created_at: string
        }
        Insert: {
          id?: string
          slug: string
          name: string
          description?: string | null
          icon?: string | null
          parent_id?: string | null
          display_order?: number
          created_at?: string
        }
        Update: {
          id?: string
          slug?: string
          name?: string
          description?: string | null
          icon?: string | null
          parent_id?: string | null
          display_order?: number
          created_at?: string
        }
      }
      tools: {
        Row: {
          id: string
          slug: string
          name: string
          tagline: string | null
          description: string | null
          logo_url: string | null
          screenshot_url: string | null
          website_url: string
          affiliate_url: string | null
          affiliate_program: string | null
          pricing_model: PricingModel | null
          pricing_details: Json
          features: string[]
          use_cases: string[]
          integrations: string[]
          meta_title: string | null
          meta_description: string | null
          is_featured: boolean
          is_verified: boolean
          status: ToolStatus
          upvotes: number
          view_count: number
          click_count: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          slug: string
          name: string
          tagline?: string | null
          description?: string | null
          logo_url?: string | null
          screenshot_url?: string | null
          website_url: string
          affiliate_url?: string | null
          affiliate_program?: string | null
          pricing_model?: PricingModel | null
          pricing_details?: Json
          features?: string[]
          use_cases?: string[]
          integrations?: string[]
          meta_title?: string | null
          meta_description?: string | null
          is_featured?: boolean
          is_verified?: boolean
          status?: ToolStatus
          upvotes?: number
          view_count?: number
          click_count?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          slug?: string
          name?: string
          tagline?: string | null
          description?: string | null
          logo_url?: string | null
          screenshot_url?: string | null
          website_url?: string
          affiliate_url?: string | null
          affiliate_program?: string | null
          pricing_model?: PricingModel | null
          pricing_details?: Json
          features?: string[]
          use_cases?: string[]
          integrations?: string[]
          meta_title?: string | null
          meta_description?: string | null
          is_featured?: boolean
          is_verified?: boolean
          status?: ToolStatus
          upvotes?: number
          view_count?: number
          click_count?: number
          created_at?: string
          updated_at?: string
        }
      }
      tool_categories: {
        Row: {
          tool_id: string
          category_id: string
          is_primary: boolean
        }
        Insert: {
          tool_id: string
          category_id: string
          is_primary?: boolean
        }
        Update: {
          tool_id?: string
          category_id?: string
          is_primary?: boolean
        }
      }
      deals: {
        Row: {
          id: string
          tool_id: string | null
          source: string
          source_url: string | null
          source_id: string | null
          deal_type: DealType | null
          title: string
          description: string | null
          original_price: number | null
          deal_price: number | null
          discount_percent: number | null
          currency: string
          coupon_code: string | null
          starts_at: string | null
          expires_at: string | null
          is_active: boolean
          affiliate_url: string | null
          submitted_by: string | null
          is_verified: boolean
          upvotes: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          tool_id?: string | null
          source: string
          source_url?: string | null
          source_id?: string | null
          deal_type?: DealType | null
          title: string
          description?: string | null
          original_price?: number | null
          deal_price?: number | null
          discount_percent?: number | null
          currency?: string
          coupon_code?: string | null
          starts_at?: string | null
          expires_at?: string | null
          is_active?: boolean
          affiliate_url?: string | null
          submitted_by?: string | null
          is_verified?: boolean
          upvotes?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          tool_id?: string | null
          source?: string
          source_url?: string | null
          source_id?: string | null
          deal_type?: DealType | null
          title?: string
          description?: string | null
          original_price?: number | null
          deal_price?: number | null
          discount_percent?: number | null
          currency?: string
          coupon_code?: string | null
          starts_at?: string | null
          expires_at?: string | null
          is_active?: boolean
          affiliate_url?: string | null
          submitted_by?: string | null
          is_verified?: boolean
          upvotes?: number
          created_at?: string
          updated_at?: string
        }
      }
      profiles: {
        Row: {
          id: string
          username: string | null
          avatar_url: string | null
          interests: string[]
          alert_preferences: Json
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          username?: string | null
          avatar_url?: string | null
          interests?: string[]
          alert_preferences?: Json
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          username?: string | null
          avatar_url?: string | null
          interests?: string[]
          alert_preferences?: Json
          created_at?: string
          updated_at?: string
        }
      }
      votes: {
        Row: {
          user_id: string
          tool_id: string
          value: number
          created_at: string
        }
        Insert: {
          user_id: string
          tool_id: string
          value: number
          created_at?: string
        }
        Update: {
          user_id?: string
          tool_id?: string
          value?: number
          created_at?: string
        }
      }
      deal_alerts: {
        Row: {
          id: string
          user_id: string
          tool_id: string | null
          category_id: string | null
          min_discount: number | null
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          tool_id?: string | null
          category_id?: string | null
          min_discount?: number | null
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          tool_id?: string | null
          category_id?: string | null
          min_discount?: number | null
          created_at?: string
        }
      }
      newsletter_subscribers: {
        Row: {
          id: string
          email: string
          interests: string[]
          digest_frequency: DigestFrequency
          is_verified: boolean
          verification_token: string | null
          unsubscribe_token: string
          created_at: string
        }
        Insert: {
          id?: string
          email: string
          interests?: string[]
          digest_frequency?: DigestFrequency
          is_verified?: boolean
          verification_token?: string | null
          unsubscribe_token?: string
          created_at?: string
        }
        Update: {
          id?: string
          email?: string
          interests?: string[]
          digest_frequency?: DigestFrequency
          is_verified?: boolean
          verification_token?: string | null
          unsubscribe_token?: string
          created_at?: string
        }
      }
      click_events: {
        Row: {
          id: string
          tool_id: string | null
          deal_id: string | null
          user_id: string | null
          session_id: string | null
          referrer: string | null
          page_url: string | null
          destination_url: string | null
          created_at: string
        }
        Insert: {
          id?: string
          tool_id?: string | null
          deal_id?: string | null
          user_id?: string | null
          session_id?: string | null
          referrer?: string | null
          page_url?: string | null
          destination_url?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          tool_id?: string | null
          deal_id?: string | null
          user_id?: string | null
          session_id?: string | null
          referrer?: string | null
          page_url?: string | null
          destination_url?: string | null
          created_at?: string
        }
      }
    }
  }
}

// Convenience types
export type Category = Database['public']['Tables']['categories']['Row']
export type Tool = Database['public']['Tables']['tools']['Row']
export type ToolInsert = Database['public']['Tables']['tools']['Insert']
export type Deal = Database['public']['Tables']['deals']['Row']
export type DealInsert = Database['public']['Tables']['deals']['Insert']
export type Profile = Database['public']['Tables']['profiles']['Row']
export type Vote = Database['public']['Tables']['votes']['Row']
export type DealAlert = Database['public']['Tables']['deal_alerts']['Row']
export type NewsletterSubscriber = Database['public']['Tables']['newsletter_subscribers']['Row']
export type ClickEvent = Database['public']['Tables']['click_events']['Row']

// Extended types with relationships
export type ToolWithCategories = Tool & {
  categories: Category[]
  primary_category?: Category
}

export type DealWithTool = Deal & {
  tool: Tool | null
}
