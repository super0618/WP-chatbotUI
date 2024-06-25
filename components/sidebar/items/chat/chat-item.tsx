import { ModelIcon } from "@/components/models/model-icon"
import { WithTooltip } from "@/components/ui/with-tooltip"
import { ChatbotUIContext } from "@/context/context"
import { LLM_LIST } from "@/lib/models/llm/llm-list"
import { cn } from "@/lib/utils"
import { LLM, Chats } from "@/types"
import { useParams, useRouter } from "next/navigation"
import { FC, useContext, useRef } from "react"
import { DeleteChat } from "./delete-chat"
import { UpdateChat } from "./update-chat"

interface ChatItemProps {
  chat: Chats
}

export const ChatItem: FC<ChatItemProps> = ({ chat }) => {
  const { chats, selectedChat, availableOpenRouterModels } =
    useContext(ChatbotUIContext)

  const router = useRouter()
  const params = useParams()
  const isActive =
    (params.chatid as string) === String(chat.id) ||
    selectedChat?.id === chat.id

  const itemRef = useRef<HTMLDivElement>(null)

  const handleClick = () => {
    if (chats.some(r => r.id === chat.id)) {
      if (params.locale) {
        if(params.locale == "en") {
          return router.push(`/chat/${chat.id}`)
        }
        return router.push(`/chat/${params.locale}/${chat.id}`)
      }
      return router.push(`/chat/${chat.id}`)
    }
    return router.push("/chat")
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === "Enter") {
      e.stopPropagation()
      itemRef.current?.click()
    }
  }

  const MODEL_DATA = [...LLM_LIST, ...availableOpenRouterModels].find(
    llm => llm.modelId === chat.model
  ) as LLM

  return (
    <div
      ref={itemRef}
      className={cn(
        "hover:bg-accent focus:bg-accent group flex w-full cursor-pointer items-center rounded p-2 hover:opacity-50 focus:outline-none",
        isActive && "bg-accent"
      )}
      tabIndex={0}
      onKeyDown={handleKeyDown}
      onClick={handleClick}
    >
      <WithTooltip
        delayDuration={200}
        display={<div>{MODEL_DATA?.modelName}</div>}
        trigger={
          <ModelIcon provider={MODEL_DATA?.provider} height={30} width={30} />
        }
      />

      <div className="mx-3 flex-1 truncate text-sm font-semibold">
        {chat.name}
      </div>

      <div
        onClick={e => {
          e.stopPropagation()
          e.preventDefault()
        }}
        className={`flex space-x-2 rtl:space-x-reverse ${!isActive && "w-11 opacity-0 group-hover:opacity-100"}`}
      >
        <UpdateChat chat={chat} />

        <DeleteChat chat={chat} />
      </div>
    </div>
  )
}
