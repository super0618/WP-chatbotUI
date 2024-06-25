import { Messages } from "@/types"
import { LLMID } from "."

export interface ChatSettings {
  model: LLMID
  prompt: string
  temperature: number
  contextLength: number
  imageSize: "1024x1024" | "1024x1792" | "1792x1024" | null
}

export interface ChatPayload {
  chatSettings: ChatSettings
  chatMessages: any[]
}

export interface ChatAPIPayload {
  chatSettings: ChatSettings
  messages: Messages[]
}

export interface Chats {
  id: number
  user_id: number
  context_length: number
  model: string
  name: string
  prompt: string
  temperature: number
  createdAt: string
  updatedAt: string | null
}
