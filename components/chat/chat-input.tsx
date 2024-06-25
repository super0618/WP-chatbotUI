import { ChatbotUIContext } from "@/context/context"
import useHotkey from "@/lib/hooks/use-hotkey"
import { cn } from "@/lib/utils"
import { IconPlayerStopFilled, IconSend } from "@tabler/icons-react"
import { FC, useContext, useEffect, useRef, useState } from "react"
import { useTranslation } from "react-i18next"
import { Input } from "../ui/input"
import { TextareaAutosize } from "../ui/textarea-autosize"
import { useChatHandler } from "./chat-hooks/use-chat-handler"
import { useChatHistoryHandler } from "./chat-hooks/use-chat-history"
import { usePromptAndCommand } from "./chat-hooks/use-prompt-and-command"
import { PromptPicker } from "./prompt-picker"
import { useRouter, useParams } from 'next/navigation'
import { toast } from "sonner"

interface ChatInputProps {}

export const ChatInput: FC<ChatInputProps> = ({}) => {
  const { t } = useTranslation()
  const router = useRouter()
  const params = useParams()

  useHotkey("l", () => {
    handleFocusChatInput()
  })

  const [isTyping, setIsTyping] = useState<boolean>(false)

  const {
    profile,
    userInput,
    chatMessages,
    chatSettings,
    isGenerating,
    selectedPreset,
    focusPrompt,
    setFocusPrompt,
    isPromptPickerOpen,
    setIsPromptPickerOpen
  } = useContext(ChatbotUIContext)

  const {
    chatInputRef,
    handleSendMessage,
    handleStopMessage,
    handleFocusChatInput
  } = useChatHandler()

  const { handleInputChange } = usePromptAndCommand()

  const {
    setNewMessageContentToNextUserMessage,
    setNewMessageContentToPreviousUserMessage
  } = useChatHistoryHandler()

  const fileInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    setTimeout(() => {
      handleFocusChatInput()
    }, 200) // FIX: hacky
  }, [selectedPreset])

  const checkValid = (callback: any) => {
    const unusableModels = ["gpt-4-turbo-preview", "gpt-4-vision-preview", "gpt-4", "dall-e-3"]
    const freeQuestions = 10

    if (!profile) {
      toast.error(t("You should log in first."), {
        action: {
          label: "Go to Login",
          onClick: () => { router.push('/my-account') }
        }
      })
      return
    }

    if (!profile.membership && unusableModels.includes(chatSettings?.model as string)) {
      toast.error(t("You should upgrade your plan to use this model."))
      return
    } else if (!profile.membership && !unusableModels.includes(chatSettings?.model as string)) {
      let storageDataStr = localStorage.getItem("chatgpt.co.il")
      if (!storageDataStr) storageDataStr = "{}"
      let storageData = JSON.parse(storageDataStr)

      if (!storageData[profile.ID]) {
        if (storageData[profile.ID] === 0) {
          toast.error(t("You have run out of free questions, upgrade your plan to continue using."))
          if (params.locale === "en") {
            return router.push("/plans")
          }
          return router.push(`/${params.locale}/plans`)
        } else {
          storageData[profile.ID] = freeQuestions
        }
      }

      storageData[profile.ID] -= 1
      toast.error(t(`${storageData[profile.ID]} remaining.`))
      localStorage.setItem("chatgpt.co.il", JSON.stringify(storageData))
    } else {
      if (!checkMembership(profile.membership[0], chatSettings?.model)) {
        toast.error(t("This model is not available in your plan. Please upgrade your plan."))
        return
      }
    }

    callback()
  }

  const checkMembership = (membership: any, model: string | undefined) => {
    const dallePlans = ["50", "75", "125", "150"]
    const stablePlans = ["110", "150"]
    const textPlans = ["70", "100", "110", "150"]

    if (model == "dall-e-3") {
      return dallePlans.includes(membership.plan_price)
    } else if (model == "stable-diffusion") {
      return stablePlans.includes(membership.plan_price)
    }
    
    return textPlans.includes(membership.plan_price)
  }

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (!isTyping && event.key === "Enter" && !event.shiftKey) {
      event.preventDefault()
      
      checkValid(() => {
        setIsPromptPickerOpen(false)
        handleSendMessage(userInput, chatMessages, false)
      })
    }

    // Consolidate conditions to avoid TypeScript error
    if (isPromptPickerOpen) {
      if (
        event.key === "Tab" ||
        event.key === "ArrowUp" ||
        event.key === "ArrowDown"
      ) {
        event.preventDefault()
        // Toggle focus based on picker type
        if (isPromptPickerOpen) setFocusPrompt(!focusPrompt)
      }
    }

    if (event.key === "ArrowUp" && event.shiftKey && event.ctrlKey) {
      event.preventDefault()
      setNewMessageContentToPreviousUserMessage()
    }

    if (event.key === "ArrowDown" && event.shiftKey && event.ctrlKey) {
      event.preventDefault()
      setNewMessageContentToNextUserMessage()
    }

    //use shift+ctrl+up and shift+ctrl+down to navigate through chat history
    if (event.key === "ArrowUp" && event.shiftKey && event.ctrlKey) {
      event.preventDefault()
      setNewMessageContentToPreviousUserMessage()
    }

    if (event.key === "ArrowDown" && event.shiftKey && event.ctrlKey) {
      event.preventDefault()
      setNewMessageContentToNextUserMessage()
    }
  }

  return (
    <>
      <div className="border-input relative mt-3 flex min-h-[60px] w-full items-center justify-center rounded-xl border-2">
        <div className="absolute bottom-[76px] left-0 max-h-[300px] w-full overflow-auto rounded-xl dark:border-none">
          <PromptPicker />
        </div>

        <Input ref={fileInputRef} className="hidden" type="file" />

        <TextareaAutosize
          textareaRef={chatInputRef}
          className="ring-offset-background placeholder:text-muted-foreground focus-visible:ring-ring text-md flex w-full resize-none rounded-md border-none bg-transparent py-2 pl-8 pr-14 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50"
          placeholder={t(`Ask anything. Type "/" for prompts.`)}
          onValueChange={handleInputChange}
          value={userInput}
          minRows={1}
          maxRows={18}
          onKeyDown={handleKeyDown}
          onCompositionStart={() => setIsTyping(true)}
          onCompositionEnd={() => setIsTyping(false)}
        />

        <div className="absolute bottom-[14px] right-3 cursor-pointer hover:opacity-50">
          {isGenerating ? (
            <IconPlayerStopFilled
              className="hover:bg-background animate-pulse rounded bg-transparent p-1"
              onClick={handleStopMessage}
              size={30}
            />
          ) : (
            <IconSend
              className={cn(
                "bg-primary text-secondary rounded p-1",
                !userInput && "cursor-not-allowed opacity-50"
              )}
              onClick={() => {
                if (!userInput) return
                
                checkValid(() => {
                  handleSendMessage(userInput, chatMessages, false)
                })
              }}
              size={30}
            />
          )}
        </div>
      </div>
    </>
  )
}
