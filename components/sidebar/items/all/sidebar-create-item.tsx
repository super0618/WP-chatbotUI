import { Button } from "@/components/ui/button"
import {
  Sheet,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle
} from "@/components/ui/sheet"
import { cn } from "@/lib/utils"
import { ChatbotUIContext } from "@/context/context"
import { ContentType } from "@/types"
import { FC, useContext, useRef, useState } from "react"
import { useTranslation } from "react-i18next"
import { toast } from "sonner"

interface SidebarCreateItemProps {
  isOpen: boolean
  isTyping: boolean
  onOpenChange: (isOpen: boolean) => void
  contentType: ContentType
  renderInputs: () => JSX.Element
  createState: any
}

export const SidebarCreateItem: FC<SidebarCreateItemProps> = ({
  isOpen,
  onOpenChange,
  contentType,
  renderInputs,
  createState,
  isTyping
}) => {
  const { t } = useTranslation()
  const { dir, setChats, setPresets, setPrompts } = useContext(ChatbotUIContext)

  const buttonRef = useRef<HTMLButtonElement>(null)

  const [creating, setCreating] = useState(false)

  const createFunctions = {
    chats: async (chat: any) => {
      const createdChatRes = await fetch("/api/chat/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(chat)
      })
      const createdChat = await createdChatRes.json()
      return createdChat
    },
    presets: async (preset: any) => {
      const createdPresetRes = await fetch("/api/preset/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(preset)
      })
      const createdPreset = await createdPresetRes.json()
      return createdPreset
    },
    prompts: async (prompt: any) => {
      const createdPromptRes = await fetch("/api/prompt/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(prompt)
      })
      const createdPrompt = await createdPromptRes.json()
      return createdPrompt
    }
  }

  const stateUpdateFunctions = {
    chats: setChats,
    presets: setPresets,
    prompts: setPrompts
  }

  const handleCreate = async () => {
    try {
      if (isTyping) return // Prevent creation while typing

      const createFunction = createFunctions[contentType]
      const setStateFunction = stateUpdateFunctions[contentType]

      if (!createFunction || !setStateFunction) return

      setCreating(true)

      const newItem = await createFunction(createState)

      setStateFunction((prevItems: any) => [...prevItems, newItem])

      onOpenChange(false)
      setCreating(false)
    } catch (error) {
      toast.error(`Error creating ${contentType.slice(0, -1)}. ${error}.`)
      setCreating(false)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (!isTyping && e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      buttonRef.current?.click()
    }
  }

  return (
    <Sheet open={isOpen} onOpenChange={onOpenChange}>
      <SheetContent
        className="flex min-w-[450px] flex-col justify-between overflow-auto"
        side={dir === "rtl" ? "right" : "left"}
        dir={dir}
        onKeyDown={handleKeyDown}
      >
        <div className="grow overflow-auto">
          <SheetHeader>
            <SheetTitle
              className={cn(
                "text-2xl font-bold",
                dir === "rtl" ? "text-right" : "text-left"
              )}
            >
              {t(
                `Create ${contentType.charAt(0).toUpperCase() + contentType.slice(1, -1)}`
              )}
            </SheetTitle>
          </SheetHeader>

          <div className="mt-4 space-y-3">{renderInputs()}</div>
        </div>

        <SheetFooter className="mt-2 flex justify-between">
          <div className="flex grow justify-end space-x-2 rtl:space-x-reverse">
            <Button
              disabled={creating}
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              {t("Cancel")}
            </Button>

            <Button disabled={creating} ref={buttonRef} onClick={handleCreate}>
              {creating ? t("Creating...") : t("Create")}
            </Button>
          </div>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  )
}
