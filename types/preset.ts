export interface Presets {
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
