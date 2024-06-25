// Only used in use-chat-handler.tsx to keep it clean

import {
  buildFinalMessages,
  buildGoogleGeminiFinalMessages
} from "@/lib/build-prompt"
import { consumeReadableStream } from "@/lib/consume-stream"
import { ChatPayload, ChatSettings, LLM } from "@/types"
import { toast } from "sonner"

export const validateChatSettings = (
  chatSettings: ChatSettings | null,
  modelData: LLM | undefined,
  messageContent: string
) => {
  if (!chatSettings) {
    throw new Error("Chat settings not found")
  }

  if (!modelData) {
    throw new Error("Model not found")
  }

  if (!messageContent) {
    throw new Error("Message content not found")
  }
}

export const createTempMessages = (
  messageContent: string,
  chatMessages: any[],
  chatSettings: ChatSettings,
  isRegeneration: boolean,
  setChatMessages: any
) => {
  let tempUserChatMessage: any = {
    chat_id: 0,
    content: messageContent,
    createdAt: "",
    id: -1,
    model: chatSettings.model,
    role: "user",
    sequence_number: chatMessages.length,
    updatedAt: ""
  }

  let tempAssistantChatMessage: any = {
    chat_id: 0,
    content: "",
    createdAt: "",
    id: -2,
    model: chatSettings.model,
    role: "assistant",
    sequence_number: chatMessages.length + 1,
    updated_at: ""
  }

  let newMessages = []

  if (isRegeneration) {
    const lastMessageIndex = chatMessages.length - 1
    chatMessages[lastMessageIndex].content = ""
    newMessages = [...chatMessages]
  } else {
    newMessages = [
      ...chatMessages,
      tempUserChatMessage,
      tempAssistantChatMessage
    ]
  }

  setChatMessages(newMessages)

  return {
    tempUserChatMessage,
    tempAssistantChatMessage
  }
}

export const handleGenerateImage = async (
  message: string,
  modelData: LLM,
  imgSize: any
) => {
  if (modelData.provider == "dalle") {
    const res = await fetch("/api/chat/dalle", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message, modelData, imgSize })
    })
    const result = await res.json()
    if (result.message) {
      toast.error(result.message)
      throw new Error(result.message)
    }
    const img_url = result.imageUrl
    return `[![image](${img_url})](${result.imageUrl})`
  } else if (modelData.provider == "stablediffusion") {
    const res = await fetch("/api/chat/stablediffusion", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message, modelData, imgSize })
    })
    const result = await res.json()
    if (result.message) {
      toast.error(result.message)
      throw new Error(result.message)
    }
    return `[![image](${result.imageUrl})](${result.imageUrl})`
  }
}

export const handleHostedChat = async (
  payload: ChatPayload,
  modelData: LLM,
  tempAssistantChatMessage: any,
  isRegeneration: boolean,
  newAbortController: AbortController,
  setIsGenerating: any,
  setFirstTokenReceived: any,
  setChatMessages: any
) => {
  const provider = modelData.provider

  let formattedMessages = []

  if (provider === "google") {
    formattedMessages = await buildGoogleGeminiFinalMessages(payload)
  } else {
    formattedMessages = await buildFinalMessages(payload)
  }

  const apiEndpoint = `/api/chat/${provider}`

  const requestBody = {
    chatSettings: payload.chatSettings,
    messages: formattedMessages
  }

  const response = await fetchChatResponse(
    apiEndpoint,
    requestBody,
    newAbortController,
    setIsGenerating,
    setChatMessages
  )

  return await processResponse(
    response,
    isRegeneration
      ? payload.chatMessages[payload.chatMessages.length - 1]
      : tempAssistantChatMessage,
    newAbortController,
    setFirstTokenReceived,
    setChatMessages
  )
}

export const fetchChatResponse = async (
  url: string,
  body: object,
  controller: AbortController,
  setIsGenerating: any,
  setChatMessages: any
) => {
  const response = await fetch(url, {
    method: "POST",
    body: JSON.stringify(body),
    signal: controller.signal
  })

  if (!response.ok) {
    const errorData = await response.json()

    toast.error(errorData.message)

    setIsGenerating(false)
    setChatMessages((prevMessages: any) => prevMessages.slice(0, -2))
  }

  return response
}

export const processResponse = async (
  response: Response,
  lastChatMessage: any,
  controller: AbortController,
  setFirstTokenReceived: any,
  setChatMessages: any
) => {
  let fullText = ""

  if (response.body) {
    await consumeReadableStream(
      response.body,
      chunk => {
        setFirstTokenReceived(true)
        fullText += chunk

        setChatMessages((prev: any) =>
          prev.map((chatMessage: any) => {
            if (chatMessage.id === lastChatMessage.id) {
              const updatedChatMessage: any = {
                ...chatMessage,
                content: chatMessage.content + chunk
              }

              return updatedChatMessage
            }

            return chatMessage
          })
        )
      },
      controller.signal
    )

    return fullText
  } else {
    throw new Error("Response body is null")
  }
}

export const handleCreateChat = async (
  chatSettings: ChatSettings,
  profile: any,
  messageContent: string,
  setSelectedChat: any,
  setChats: any
) => {
  const payload = {
    user_id: profile.ID,
    context_length: chatSettings.contextLength,
    model: chatSettings.model,
    name: messageContent.substring(0, 100),
    prompt: chatSettings.prompt,
    temperature: chatSettings.temperature
  }
  const createdChatRes = await fetch("/api/chat/create", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(payload)
  })
  const createdChat = await createdChatRes.json()

  setSelectedChat(createdChat)
  setChats((chats: any) => [createdChat, ...chats])

  return createdChat
}
