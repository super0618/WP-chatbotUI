import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from "@/components/ui/dialog"
import { ChatbotUIContext } from "@/context/context"
import { ContentType, DataItemType, Chats, Presets, Prompts } from "@/types"
import { FC, useContext, useRef, useState } from "react"
import { useTranslation } from "react-i18next"

interface SidebarDeleteItemProps {
  item: DataItemType
  contentType: ContentType
}

export const SidebarDeleteItem: FC<SidebarDeleteItemProps> = ({
  item,
  contentType
}) => {
  const { t } = useTranslation()
  const { dir, setChats, setPresets, setPrompts } = useContext(ChatbotUIContext)

  const buttonRef = useRef<HTMLButtonElement>(null)

  const [showDialog, setShowDialog] = useState(false)

  const deleteFunctions = {
    chats: async (chat: Chats) => {
      const payload = { id: chat.id }
      const deletedChatRes = await fetch("/api/chat/delete", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      })
      await deletedChatRes.json()
    },
    presets: async (preset: Presets) => {
      const payload = { id: preset.id }
      const deletedPresetRes = await fetch("/api/preset/delete", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      })
      await deletedPresetRes.json()
    },
    prompts: async (prompt: Prompts) => {
      const payload = { id: prompt.id }
      const deletedPromptRes = await fetch("/api/prompt/delete", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      })
      await deletedPromptRes.json()
    }
  }

  const stateUpdateFunctions = {
    chats: setChats,
    presets: setPresets,
    prompts: setPrompts
  }

  const handleDelete = async () => {
    const deleteFunction = deleteFunctions[contentType]
    const setStateFunction = stateUpdateFunctions[contentType]

    if (!deleteFunction || !setStateFunction) return

    await deleteFunction(item as any)

    setStateFunction((prevItems: any) =>
      prevItems.filter((prevItem: any) => prevItem.id !== item.id)
    )

    setShowDialog(false)
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === "Enter") {
      e.stopPropagation()
      buttonRef.current?.click()
    }
  }

  return (
    <Dialog open={showDialog} onOpenChange={setShowDialog}>
      <DialogTrigger asChild>
        <Button className="text-red-500" variant="ghost">
          {t("Delete")}
        </Button>
      </DialogTrigger>

      <DialogContent onKeyDown={handleKeyDown}>
        <DialogHeader>
          <DialogTitle className={dir === "rtl" ? "text-right" : "text-left"}>
            {t(
              `Delete ${contentType[0].toUpperCase() + contentType.slice(1, -1)}`
            )}
          </DialogTitle>

          <DialogDescription
            className={dir === "rtl" ? "text-right" : "text-left"}
          >
            {t(
              `Are you sure you want to delete this ${contentType.substring(0, contentType.length - 1)}?`
            )}
          </DialogDescription>
        </DialogHeader>

        <DialogFooter>
          <Button variant="ghost" onClick={() => setShowDialog(false)}>
            {t("Cancel")}
          </Button>

          <Button ref={buttonRef} variant="destructive" onClick={handleDelete}>
            {t("Delete")}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
