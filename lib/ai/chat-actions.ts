"use server"

import { getSupabaseServerClient } from "@/lib/supabase/server"

export interface ChatMessage {
  id: string
  role: 'user' | 'assistant'
  content: string
  file_url?: string
  file_name?: string
  file_type?: string
  file_size?: number
  created_at: string
}

export interface SaveMessageData {
  userId: string
  role: 'user' | 'assistant'
  content: string
  fileUrl?: string
  fileName?: string
  fileType?: string
  fileSize?: number
}

export async function saveChatMessage(data: SaveMessageData) {
  const supabase = await getSupabaseServerClient()
  
  if (!supabase) {
    return {
      success: false,
      error: "Database connection failed"
    }
  }

  try {
    const { data: message, error } = await supabase
      .from('ai_interactions')
      .insert({
        user_id: data.userId,
        role: data.role,
        content: data.content,
        file_url: data.fileUrl,
        file_name: data.fileName,
        file_type: data.fileType,
        file_size: data.fileSize
      })
      .select()
      .single()

    if (error) {
      console.error('Error saving chat message:', error)
      return {
        success: false,
        error: error.message
      }
    }

    return {
      success: true,
      message
    }
  } catch (error) {
    console.error('Error saving chat message:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to save message"
    }
  }
}

export async function getChatHistory(userId: string, limit: number = 50) {
  const supabase = await getSupabaseServerClient()
  
  if (!supabase) {
    return {
      success: false,
      data: []
    }
  }

  try {
    const { data: messages, error } = await supabase
      .from('ai_interactions')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: true })
      .limit(limit)

    if (error) {
      console.error('Error fetching chat history:', error)
      return {
        success: false,
        data: []
      }
    }

    return {
      success: true,
      data: messages || []
    }
  } catch (error) {
    console.error('Error fetching chat history:', error)
    return {
      success: false,
      data: []
    }
  }
}