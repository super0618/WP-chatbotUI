import { Button } from "@/components/ui/button"
import {
  Sheet,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger
} from "@/components/ui/sheet"
import { ChatbotUIContext } from "@/context/context"
import { ContentType, DataItemType, Chats, Presets, Prompts } from "@/types"
import { FC, useContext, useRef, useState } from "react"
import { useTranslation } from "react-i18next"
import { toast } from "sonner"
import { cn } from "@/lib/utils"
import { SidebarDeleteItem } from "./sidebar-delete-item"

interface SidebarUpdateItemProps {
  isTyping: boolean
  item: DataItemType
  contentType: ContentType
  children: React.ReactNode
  renderInputs: (renderState: any) => JSX.Element
  updateState: any
}

export const SidebarUpdateItem: FC<SidebarUpdateItemProps> = ({
  item,
  contentType,
  children,
  renderInputs,
  updateState,
  isTyping
}) => {
  const { t } = useTranslation()
  const { dir, setChats, setPresets, setPrompts } = useContext(ChatbotUIContext)

  const buttonRef = useRef<HTMLButtonElement>(null)

  const [isOpen, setIsOpen] = useState(false)

  const renderState = {
    chats: null,
    presets: null,
    prompts: null
  }

  const fetchDataFunctions = {
    chats: null,
    presets: null,
    prompts: null
  }

  const updateFunctions = {
    chats: async (chatId: number, updateState: Chats) => {
      console.log(chatId)
      console.log(updateState)
    },
    presets: async (presetId: number, updateState: Presets) => {
      const payload = { id: presetId, updateState }
      const updatedPresetRes = await fetch("/api/preset/update", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      })
      const updatedPreset = await updatedPresetRes.json()

      return updatedPreset
    },
    prompts: async (promptId: number, updateState: Prompts) => {
      const payload = { id: promptId, updateState }
      const updatedPromptRes = await fetch("/api/prompt/update", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      })
      const updatedPrompt = await updatedPromptRes.json()

      return updatedPrompt
    }
  }

  const stateUpdateFunctions = {
    chats: setChats,
    presets: setPresets,
    prompts: setPrompts
  }

  const handleUpdate = async () => {
    try {
      const updateFunction = updateFunctions[contentType]
      const setStateFunction = stateUpdateFunctions[contentType]

      if (!updateFunction || !setStateFunction) return
      if (isTyping) return // Prevent update while typing

      const updatedItem = await updateFunction(item.id, updateState)

      setStateFunction((prevItems: any) =>
        prevItems.map((prevItem: any) =>
          prevItem.id === item.id ? updatedItem : prevItem
        )
      )

      setIsOpen(false)

      toast.success(`${contentType.slice(0, -1)} updated successfully`)
    } catch (error) {
      toast.error(`Error updating ${contentType.slice(0, -1)}. ${error}`)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (!isTyping && e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      buttonRef.current?.click()
    }
  }

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>{children}</SheetTrigger>

      <SheetContent
        className="flex min-w-[450px] flex-col justify-between"
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
                `Edit ${contentType[0].toUpperCase() + contentType.slice(1, -1)}`
              )}
            </SheetTitle>
          </SheetHeader>

          <div className="mt-4 space-y-3">
            {renderInputs(renderState[contentType])}
          </div>
        </div>

        <SheetFooter className="mt-2 flex justify-between">
          <SidebarDeleteItem item={item} contentType={contentType} />

          <div className="flex grow justify-end space-x-2 rtl:space-x-reverse">
            <Button variant="outline" onClick={() => setIsOpen(false)}>
              {t("Cancel")}
            </Button>

            <Button ref={buttonRef} onClick={handleUpdate}>
              {t("Save")}
            </Button>
          </div>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  )
}
