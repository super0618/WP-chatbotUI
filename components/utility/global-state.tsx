// TODO: Separate into multiple contexts, keeping simple for now

"use client"

import { ChatbotUIContext } from "@/context/context"
import {
  fetchHostedModels,
  fetchOpenRouterModels
} from "@/lib/models/fetch-models"
import {
  ChatSettings,
  LLM,
  OpenRouterLLM,
  Chats,
  Folders,
  Presets,
  Prompts
} from "@/types"
import { FC, useEffect, useState } from "react"

interface GlobalStateProps {
  children: React.ReactNode
}

export const GlobalState: FC<GlobalStateProps> = ({ children }) => {
  // DIR
  const [dir, setDir] = useState<string>("ltr")

  // PROFILE STORE
  const [profile, setProfile] = useState(null)

  // ITEMS STORE
  const [chats, setChats] = useState<Chats[]>([])
  const [folders, setFolders] = useState<Folders[]>([])
  const [presets, setPresets] = useState<Presets[]>([])
  const [prompts, setPrompts] = useState<Prompts[]>([])

  // MODELS STORE
  const [availableHostedModels, setAvailableHostedModels] = useState<LLM[]>([])
  const [availableOpenRouterModels, setAvailableOpenRouterModels] = useState<
    OpenRouterLLM[]
  >([])

  // PRESET STORE
  const [selectedPreset, setSelectedPreset] = useState<any>(null)

  // PASSIVE CHAT STORE
  const [userInput, setUserInput] = useState<string>("")
  const [chatMessages, setChatMessages] = useState<any[]>([])
  const [chatSettings, setChatSettings] = useState<ChatSettings>({
    model: "gpt-3.5-turbo",
    prompt: "You are a helpful AI assistant.",
    temperature: 0.5,
    contextLength: 4000,
    imageSize: "1024x1024"
  })
  const [selectedChat, setSelectedChat] = useState<Chats | null>(null)

  // ACTIVE CHAT STORE
  const [isGenerating, setIsGenerating] = useState<boolean>(false)
  const [firstTokenReceived, setFirstTokenReceived] = useState<boolean>(false)
  const [abortController, setAbortController] =
    useState<AbortController | null>(null)

  // CHAT INPUT COMMAND STORE
  const [isPromptPickerOpen, setIsPromptPickerOpen] = useState(false)
  const [slashCommand, setSlashCommand] = useState("")
  const [focusPrompt, setFocusPrompt] = useState(false)

  useEffect(() => {
    ;(async () => {
      const hostedModelRes = await fetchHostedModels()
      if (!hostedModelRes) return
      setAvailableHostedModels(hostedModelRes.hostedModels)

      if (!process.env.OPENROUTER_API_KEY) return
      const openRouterModels = await fetchOpenRouterModels()
      if (!openRouterModels) return
      setAvailableOpenRouterModels(openRouterModels)
    })()
  }, [])

  return (
    <ChatbotUIContext.Provider
      value={{
        // DIR
        dir,
        setDir,

        // PROFILE STORE
        profile,
        setProfile,

        // ITEMS STORE
        chats,
        setChats,
        folders,
        setFolders,
        presets,
        setPresets,
        prompts,
        setPrompts,

        // MODELS STORE
        availableHostedModels,
        setAvailableHostedModels,
        availableOpenRouterModels,
        setAvailableOpenRouterModels,

        // PRESET STORE
        selectedPreset,
        setSelectedPreset,

        // PASSIVE CHAT STORE
        userInput,
        setUserInput,
        chatMessages,
        setChatMessages,
        chatSettings,
        setChatSettings,
        selectedChat,
        setSelectedChat,

        // ACTIVE CHAT STORE
        isGenerating,
        setIsGenerating,
        firstTokenReceived,
        setFirstTokenReceived,
        abortController,
        setAbortController,

        // CHAT INPUT COMMAND STORE
        isPromptPickerOpen,
        setIsPromptPickerOpen,
        slashCommand,
        setSlashCommand,
        focusPrompt,
        setFocusPrompt
      }}
    >
      {children}
    </ChatbotUIContext.Provider>
  )
}
