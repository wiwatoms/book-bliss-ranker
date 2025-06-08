export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      covers: {
        Row: {
          created_at: string
          global_score: number
          id: string
          image_url: string
          is_active: boolean
          vote_count: number
        }
        Insert: {
          created_at?: string
          global_score?: number
          id?: string
          image_url: string
          is_active?: boolean
          vote_count?: number
        }
        Update: {
          created_at?: string
          global_score?: number
          id?: string
          image_url?: string
          is_active?: boolean
          vote_count?: number
        }
        Relationships: []
      }
      survey_answers: {
        Row: {
          created_at: string
          id: string
          interest_level: number
          reading_habits: string[]
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          interest_level: number
          reading_habits: string[]
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          interest_level?: number
          reading_habits?: string[]
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "survey_answers_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      titles: {
        Row: {
          created_at: string
          global_score: number
          id: string
          is_active: boolean
          text: string
          vote_count: number
        }
        Insert: {
          created_at?: string
          global_score?: number
          id?: string
          is_active?: boolean
          text: string
          vote_count?: number
        }
        Update: {
          created_at?: string
          global_score?: number
          id?: string
          is_active?: boolean
          text?: string
          vote_count?: number
        }
        Relationships: []
      }
      users: {
        Row: {
          completed_steps: number
          created_at: string
          feedback: string | null
          id: string
          is_admin: boolean
          name: string
        }
        Insert: {
          completed_steps?: number
          created_at?: string
          feedback?: string | null
          id?: string
          is_admin?: boolean
          name: string
        }
        Update: {
          completed_steps?: number
          created_at?: string
          feedback?: string | null
          id?: string
          is_admin?: boolean
          name?: string
        }
        Relationships: []
      }
      votes: {
        Row: {
          id: string
          item_type: string
          local_loser_score: number
          local_winner_score: number
          loser_item_id: string
          timestamp: string
          user_id: string
          winner_item_id: string
        }
        Insert: {
          id?: string
          item_type: string
          local_loser_score: number
          local_winner_score: number
          loser_item_id: string
          timestamp?: string
          user_id: string
          winner_item_id: string
        }
        Update: {
          id?: string
          item_type?: string
          local_loser_score?: number
          local_winner_score?: number
          loser_item_id?: string
          timestamp?: string
          user_id?: string
          winner_item_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "votes_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
