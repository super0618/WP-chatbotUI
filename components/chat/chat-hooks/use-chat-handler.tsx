import { ChatbotUIContext } from "@/context/context"
import { ChatPayload, LLMID } from "@/types"
import { useParams, useRouter } from "next/navigation"
import { useContext, useRef } from "react"
import { LLM_LIST } from "../../../lib/models/llm/llm-list"
import {
  createTempMessages,
  handleHostedChat,
  handleGenerateImage,
  validateChatSettings
} from "../chat-helpers"

export const useChatHandler = () => {
  const router = useRouter()
  const params = useParams()

  const {
    profile,
    setUserInput,
    setIsGenerating,
    setChatMessages,
    setFirstTokenReceived,
    selectedChat,
    setSelectedChat,
    setChats,
    availableOpenRouterModels,
    abortController,
    setAbortController,
    chatSettings,
    chatMessages,
    setIsPromptPickerOpen,
    selectedPreset,
    setChatSettings
  } = useContext(ChatbotUIContext)

  const chatInputRef = useRef<HTMLTextAreaElement>(null)

  // useEffect(() => {
  //   if (!isPromptPickerOpen || !isFilePickerOpen || !isToolPickerOpen) {
  //     chatInputRef.current?.focus()
  //   }
  // }, [isPromptPickerOpen, isFilePickerOpen, isToolPickerOpen])

  const handleNewChat = async () => {
    setUserInput("")
    setChatMessages([])
    setSelectedChat(null)

    setIsGenerating(false)
    setFirstTokenReceived(false)

    setIsPromptPickerOpen(false)

    if (selectedPreset) {
      setChatSettings({
        model: selectedPreset.model as LLMID,
        prompt: selectedPreset.prompt,
        temperature: selectedPreset.temperature,
        contextLength: selectedPreset.context_length,
        imageSize: "1024x1024"
      })
    }

    if (params.locale == "en") {
      return router.push("/chat")
    }
    return router.push(`/chat/${params.locale}`)
  }

  const handleFocusChatInput = () => {
    chatInputRef.current?.focus()
  }

  const handleStopMessage = () => {
    if (abortController) {
      abortController.abort()
    }
  }

  const handleSendMessage = async (
    messageContent: string,
    chatMessages: any[],
    isRegeneration: boolean
  ) => {
    const startingInput = isRegeneration ? "" : messageContent

    try {
      setUserInput("")
      setIsGenerating(true)
      setIsPromptPickerOpen(false)

      const newAbortController = new AbortController()
      setAbortController(newAbortController)

      const modelData = [...LLM_LIST, ...availableOpenRouterModels].find(
        llm => llm.modelId === chatSettings?.model
      )

      validateChatSettings(chatSettings, modelData, messageContent)

      let currentChat = selectedChat ? { ...selectedChat } : null

      const { tempUserChatMessage, tempAssistantChatMessage } =
        createTempMessages(
          messageContent,
          chatMessages,
          chatSettings!,
          isRegeneration,
          setChatMessages
        )

      let generatedText = ""

      let payload: ChatPayload = {
        chatSettings: chatSettings!,
        chatMessages: isRegeneration
          ? [...chatMessages]
          : [...chatMessages, tempUserChatMessage]
      }

      if (
        modelData?.provider === "dalle" ||
        modelData?.provider === "stablediffusion"
      ) {
        generatedText = (await handleGenerateImage(
          messageContent,
          modelData,
          chatSettings?.imageSize
        )) as string
      } else {
        generatedText = await handleHostedChat(
          payload,
          modelData!,
          tempAssistantChatMessage,
          isRegeneration,
          newAbortController,
          setIsGenerating,
          setFirstTokenReceived,
          setChatMessages
        )
      }

      if (!currentChat) {
        const payload = {
          user_id: profile.ID,
          context_length: chatSettings?.contextLength,
          model: chatSettings?.model,
          name: messageContent.substring(0, 100),
          prompt: chatSettings?.prompt,
          temperature: chatSettings?.temperature
        }
        const createdChatRes = await fetch("/api/chat/create", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload)
        })
        const createdChat = await createdChatRes.json()

        setSelectedChat(createdChat)
        setChats(chats => [createdChat, ...chats])

        currentChat = createdChat
      } else {
        const payload = {
          id: currentChat.id,
          updatedAt: new Date().toISOString()
        }
        const updatedChatRes = await fetch("/api/chat/updatedate", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload)
        })
        const updatedChat = await updatedChatRes.json()

        setChats(prevChats => {
          const updatedChats = prevChats.map(prevChat =>
            prevChat.id === updatedChat.id ? updatedChat : prevChat
          )

          return updatedChats
        })
      }

      let finalChatMessages = []

      if (isRegeneration) {
        const lastStartingMessage = chatMessages[chatMessages.length - 1]

        const payload = {
          id: lastStartingMessage.id,
          content: generatedText
        }

        const updatedMessageRes = await fetch("/api/message/update", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload)
        })
        const updatedMessage = await updatedMessageRes.json()

        chatMessages[chatMessages.length - 1] = updatedMessage

        finalChatMessages = [...chatMessages]

        setChatMessages(finalChatMessages)
      } else {
        const finalUserMessage: any = {
          chat_id: currentChat!.id,
          content: messageContent,
          model: modelData!.modelId,
          role: "user",
          sequence_number: chatMessages.length
        }

        const finalAssistantMessage: any = {
          chat_id: currentChat!.id,
          content: generatedText,
          model: modelData!.modelId,
          role: "assistant",
          sequence_number: chatMessages.length + 1
        }

        const payload = [finalUserMessage, finalAssistantMessage]

        const createdMessagesRes = await fetch("/api/messages/create", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload)
        })
        const createdMessages = await createdMessagesRes.json()

        finalChatMessages = [...chatMessages, ...createdMessages]

        setChatMessages(finalChatMessages)
      }

      setIsGenerating(false)
      setFirstTokenReceived(false)
      setUserInput("")
    } catch (error) {
      let newMessages = chatMessages.slice(0, -2)
      setChatMessages(newMessages)
      setIsGenerating(false)
      setFirstTokenReceived(false)
      setUserInput(startingInput)
    }
  }

  const handleSendEdit = async (
    editedContent: string,
    sequenceNumber: number
  ) => {
    if (!selectedChat) return

    const payload = { chat_id: selectedChat.id, sequence: sequenceNumber }
    const deletedMessagesRes = await fetch("/api/messages/deleteafter", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    })
    await deletedMessagesRes.json()

    const filteredMessages = chatMessages.filter(
      chatMessage => chatMessage.sequence_number < sequenceNumber
    )

    setChatMessages(filteredMessages)

    handleSendMessage(editedContent, filteredMessages, false)
  }

  return {
    chatInputRef,
    handleNewChat,
    handleSendMessage,
    handleFocusChatInput,
    handleStopMessage,
    handleSendEdit
  }
}
