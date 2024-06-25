import { ChatPayload, Messages } from "@/types"
import { encode } from "gpt-tokenizer"

const buildBasePrompt = (prompt: string) => {
  let fullPrompt = ""

  fullPrompt += `Today is ${new Date().toLocaleDateString()}.\n\n`

  fullPrompt += `User Instructions:\n${prompt}`

  return fullPrompt
}

export async function buildFinalMessages(payload: any) {
  const { chatSettings, chatMessages } = payload

  const BUILT_PROMPT = buildBasePrompt(chatSettings.prompt)

  const CHUNK_SIZE = chatSettings.contextLength
  const PROMPT_TOKENS = encode(chatSettings.prompt).length

  let remainingTokens = CHUNK_SIZE - PROMPT_TOKENS

  let usedTokens = 0
  usedTokens += PROMPT_TOKENS

  const processedChatMessages = chatMessages.map(
    (chatMessage: any, index: number) => {
      const nextChatMessage = chatMessages[index + 1]

      if (nextChatMessage === undefined) {
        return chatMessage
      }

      return chatMessage
    }
  )

  let finalMessages = []

  for (let i = processedChatMessages.length - 1; i >= 0; i--) {
    const message = processedChatMessages[i]
    const messageTokens = encode(message.content).length

    if (messageTokens <= remainingTokens) {
      remainingTokens -= messageTokens
      usedTokens += messageTokens
      finalMessages.unshift(message)
    } else {
      break
    }
  }

  let tempSystemMessage: Messages = {
    chat_id: 0,
    content: BUILT_PROMPT,
    createdAt: "",
    id: processedChatMessages.length,
    model: payload.chatSettings.model,
    role: "system",
    sequence_number: processedChatMessages.length,
    updatedAt: ""
  }

  finalMessages.unshift(tempSystemMessage)

  finalMessages = finalMessages.map(message => {
    let content

    content = message.content

    return {
      role: message.role,
      content
    }
  })

  return finalMessages
}

export async function buildGoogleGeminiFinalMessages(payload: ChatPayload) {
  const { chatSettings, chatMessages } = payload

  const BUILT_PROMPT = buildBasePrompt(chatSettings.prompt)

  let finalMessages = []

  let usedTokens = 0
  const CHUNK_SIZE = chatSettings.contextLength
  const PROMPT_TOKENS = encode(chatSettings.prompt).length
  let REMAINING_TOKENS = CHUNK_SIZE - PROMPT_TOKENS

  usedTokens += PROMPT_TOKENS

  for (let i = chatMessages.length - 1; i >= 0; i--) {
    const message = chatMessages[i]
    const messageTokens = encode(message.content).length

    if (messageTokens <= REMAINING_TOKENS) {
      REMAINING_TOKENS -= messageTokens
      usedTokens += messageTokens
      finalMessages.unshift(message)
    } else {
      break
    }
  }

  let tempSystemMessage: Messages = {
    chat_id: 0,
    content: BUILT_PROMPT,
    createdAt: "",
    id: chatMessages.length,
    model: payload.chatSettings.model,
    role: "system",
    sequence_number: chatMessages.length,
    updatedAt: ""
  }

  finalMessages.unshift(tempSystemMessage)

  let GOOGLE_FORMATTED_MESSAGES = []

  if (chatSettings.model === "gemini-pro") {
    GOOGLE_FORMATTED_MESSAGES = [
      {
        role: "user",
        parts: finalMessages[0].content
      },
      {
        role: "model",
        parts: "I will follow your instructions."
      }
    ]

    for (let i = 1; i < finalMessages.length; i++) {
      GOOGLE_FORMATTED_MESSAGES.push({
        role: finalMessages[i].role === "user" ? "user" : "model",
        parts: finalMessages[i].content as string
      })
    }

    return GOOGLE_FORMATTED_MESSAGES
  } else if ((chatSettings.model = "gemini-pro-vision")) {
    // Gemini Pro Vision doesn't currently support messages
    async function fileToGenerativePart(file: File) {
      const base64EncodedDataPromise = new Promise(resolve => {
        const reader = new FileReader()

        reader.onloadend = () => {
          if (typeof reader.result === "string") {
            resolve(reader.result.split(",")[1])
          }
        }

        reader.readAsDataURL(file)
      })

      return {
        inlineData: {
          data: await base64EncodedDataPromise,
          mimeType: file.type
        }
      }
    }

    let prompt = ""

    for (let i = 0; i < finalMessages.length; i++) {
      prompt += `${finalMessages[i].role}:\n${finalMessages[i].content}\n\n`
    }

    // FIX: Hacky until chat messages are supported
    return [{ prompt }]
  }

  return finalMessages
}
