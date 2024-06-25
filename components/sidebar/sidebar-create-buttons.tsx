import { useChatHandler } from "@/components/chat/chat-hooks/use-chat-handler"
import { ChatbotUIContext } from "@/context/context"
// import { createFolder } from "@/db/folders"
import { ContentType } from "@/types"
import { IconFolderPlus, IconPlus } from "@tabler/icons-react"
import { FC, useContext, useState } from "react"
import { useTranslation } from "react-i18next"
import { Button } from "../ui/button"
import { CreatePreset } from "./items/presets/create-preset"
import { CreatePrompt } from "./items/prompts/create-prompt"

interface SidebarCreateButtonsProps {
  contentType: ContentType
  hasData: boolean
}

export const SidebarCreateButtons: FC<SidebarCreateButtonsProps> = ({
  contentType,
  hasData
}) => {
  const { t } = useTranslation()
  const { profile, folders, setFolders } = useContext(ChatbotUIContext)
  const { handleNewChat } = useChatHandler()

  const [isCreatingPrompt, setIsCreatingPrompt] = useState(false)
  const [isCreatingPreset, setIsCreatingPreset] = useState(false)

  const handleCreateFolder = async () => {
    // const createdFolder = await createFolder({
    //   user_id: profile.ID,
    //   name: "New Folder",
    //   description: "",
    //   type: contentType
    // })
    // setFolders([...folders, createdFolder])
  }

  const getCreateFunction = () => {
    switch (contentType) {
      case "chats":
        return async () => {
          handleNewChat()
        }

      case "presets":
        return async () => {
          setIsCreatingPreset(true)
        }

      case "prompts":
        return async () => {
          setIsCreatingPrompt(true)
        }

      default:
        break
    }
  }

  return (
    <div className="flex w-full">
      <Button className="flex h-[36px] grow" onClick={getCreateFunction()}>
        <IconPlus className="mr-1" size={20} />
        {t(
          `New ${contentType.charAt(0).toUpperCase() + contentType.slice(1, contentType.length - 1)}`
        )}
      </Button>

      {isCreatingPrompt && (
        <CreatePrompt
          isOpen={isCreatingPrompt}
          onOpenChange={setIsCreatingPrompt}
        />
      )}

      {isCreatingPreset && (
        <CreatePreset
          isOpen={isCreatingPreset}
          onOpenChange={setIsCreatingPreset}
        />
      )}
    </div>
  )
}
