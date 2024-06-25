export interface Messages {
  id: number
  chat_id: number
  content: string
  model: string
  role: string
  sequence_number: number
  createdAt: string
  updatedAt: string | null
}
