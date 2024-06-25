import {
  ChatSettings,
  LLM,
  OpenRouterLLM,
  Chats,
  Folders,
  Presets,
  Prompts
} from "@/types"
import { Dispatch, SetStateAction, createContext } from "react"

interface ChatbotUIContext {
  // DIR
  dir: string
  setDir: Dispatch<SetStateAction<string>>

  // PROFILE STORE
  profile: any | null
  setProfile: Dispatch<SetStateAction<any | null>>

  // ITEMS STORE
  chats: Chats[]
  setChats: Dispatch<SetStateAction<Chats[]>>
  folders: Folders[]
  setFolders: Dispatch<SetStateAction<Folders[]>>
  presets: Presets[]
  setPresets: Dispatch<SetStateAction<Presets[]>>
  prompts: Prompts[]
  setPrompts: Dispatch<SetStateAction<Prompts[]>>

  // MODELS STORE
  availableHostedModels: LLM[]
  setAvailableHostedModels: Dispatch<SetStateAction<LLM[]>>
  availableOpenRouterModels: OpenRouterLLM[]
  setAvailableOpenRouterModels: Dispatch<SetStateAction<OpenRouterLLM[]>>

  // PRESET STORE
  selectedPreset: Presets | null
  setSelectedPreset: Dispatch<SetStateAction<Presets | null>>

  // PASSIVE CHAT STORE
  userInput: string
  setUserInput: Dispatch<SetStateAction<string>>
  chatMessages: any[]
  setChatMessages: Dispatch<SetStateAction<any[]>>
  chatSettings: ChatSettings | null
  setChatSettings: Dispatch<SetStateAction<ChatSettings>>
  selectedChat: Chats | null
  setSelectedChat: Dispatch<SetStateAction<Chats | null>>

  // ACTIVE CHAT STORE
  abortController: AbortController | null
  setAbortController: Dispatch<SetStateAction<AbortController | null>>
  firstTokenReceived: boolean
  setFirstTokenReceived: Dispatch<SetStateAction<boolean>>
  isGenerating: boolean
  setIsGenerating: Dispatch<SetStateAction<boolean>>

  // CHAT INPUT COMMAND STORE
  isPromptPickerOpen: boolean
  setIsPromptPickerOpen: Dispatch<SetStateAction<boolean>>
  slashCommand: string
  setSlashCommand: Dispatch<SetStateAction<string>>
  focusPrompt: boolean
  setFocusPrompt: Dispatch<SetStateAction<boolean>>
}

export const ChatbotUIContext = createContext<ChatbotUIContext>({
  // DIR
  dir: "",
  setDir: () => {},

  // PROFILE STORE
  profile: null,
  setProfile: () => {},

  // ITEMS STORE
  chats: [],
  setChats: () => {},
  folders: [],
  setFolders: () => {},
  presets: [],
  setPresets: () => {},
  prompts: [],
  setPrompts: () => {},

  // MODELS STORE
  availableHostedModels: [],
  setAvailableHostedModels: () => {},
  availableOpenRouterModels: [],
  setAvailableOpenRouterModels: () => {},

  // PRESET STORE
  selectedPreset: null,
  setSelectedPreset: () => {},

  // PASSIVE CHAT STORE
  userInput: "",
  setUserInput: () => {},
  selectedChat: null,
  setSelectedChat: () => {},
  chatMessages: [],
  setChatMessages: () => {},
  chatSettings: null,
  setChatSettings: () => {},

  // ACTIVE CHAT STORE
  isGenerating: false,
  setIsGenerating: () => {},
  firstTokenReceived: false,
  setFirstTokenReceived: () => {},
  abortController: null,
  setAbortController: () => {},

  // CHAT INPUT COMMAND STORE
  isPromptPickerOpen: false,
  setIsPromptPickerOpen: () => {},
  slashCommand: "",
  setSlashCommand: () => {},
  focusPrompt: false,
  setFocusPrompt: () => {}
})
