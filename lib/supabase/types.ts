export type FoundationDataType = 'voice_profile' | 'ica' | 'offer_stack' | 'credential_bank'

export interface SetupStatus {
  user_id: string
  tier: string
  onboarding_complete: boolean
  percentage_complete: number
  blocks_completed: string[]
  owner_name: string
  owner_brand: string
  updated_at: string
}

export interface Conversation {
  id: string
  user_id: string
  title: string | null
  created_at: string
  updated_at: string
}

export interface Message {
  id: string
  conversation_id: string
  role: 'user' | 'assistant'
  content: string
  created_at: string
}
