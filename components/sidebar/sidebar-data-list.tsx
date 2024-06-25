import { ChatbotUIContext } from "@/context/context"
import { cn } from "@/lib/utils"
import {
  ContentType,
  DataItemType,
  DataListType,
  Folders,
  Chats,
  Presets,
  Prompts
} from "@/types"
import { FC, useContext, useEffect, useRef, useState } from "react"
import { Separator } from "../ui/separator"
import { ChatItem } from "./items/chat/chat-item"
import { Folder } from "./items/folders/folder-item"
import { PresetItem } from "./items/presets/preset-item"
import { PromptItem } from "./items/prompts/prompt-item"
import { useTranslation } from "react-i18next"

interface SidebarDataListProps {
  contentType: ContentType
  data: DataListType
  folders: Folders[]
}

export const SidebarDataList: FC<SidebarDataListProps> = ({
  contentType,
  data,
  folders
}) => {
  const { t } = useTranslation()
  const { setChats, setPresets, setPrompts } = useContext(ChatbotUIContext)

  const divRef = useRef<HTMLDivElement>(null)

  const [isOverflowing, setIsOverflowing] = useState(false)
  const [isDragOver, setIsDragOver] = useState(false)

  const getDataListComponent = (
    contentType: ContentType,
    item: DataItemType
  ) => {
    switch (contentType) {
      case "chats":
        return <ChatItem key={item.id} chat={item as Chats} />

      case "presets":
        return <PresetItem key={item.id} preset={item as Presets} />

      case "prompts":
        return <PromptItem key={item.id} prompt={item as Prompts} />

      default:
        return null
    }
  }

  const getSortedData = (
    data: any,
    dateCategory: "Today" | "Yesterday" | "Previous Week" | "Older"
  ) => {
    const now = new Date()
    const todayStart = new Date(now.setHours(0, 0, 0, 0))
    const yesterdayStart = new Date(
      new Date().setDate(todayStart.getDate() - 1)
    )
    const oneWeekAgoStart = new Date(
      new Date().setDate(todayStart.getDate() - 7)
    )

    return data
      .filter((item: any) => {
        const itemDate = new Date(item.updatedAt || item.createdAt)
        switch (dateCategory) {
          case "Today":
            return itemDate >= todayStart
          case "Yesterday":
            return itemDate >= yesterdayStart && itemDate < todayStart
          case "Previous Week":
            return itemDate >= oneWeekAgoStart && itemDate < yesterdayStart
          case "Older":
            return itemDate < oneWeekAgoStart
          default:
            return true
        }
      })
      .sort(
        (
          a: { updatedAt: string; createdAt: string },
          b: { updatedAt: string; createdAt: string }
        ) =>
          new Date(b.updatedAt || b.createdAt).getTime() -
          new Date(a.updatedAt || a.createdAt).getTime()
      )
  }

  const updateFunctions = {
    chats: async () => {},
    presets: async () => {},
    prompts: async () => {},
    folders: async () => {}
  }

  const stateUpdateFunctions = {
    chats: setChats,
    presets: setPresets,
    prompts: setPrompts,
    folders: () => {}
  }

  const updateFolder = async (itemId: number, folderId: number) => {
    const item: any = data.find(item => item.id === itemId)

    if (!item) return null

    const updateFunction = updateFunctions[contentType]
    const setStateFunction = stateUpdateFunctions[contentType]

    if (!updateFunction || !setStateFunction) return

    // const updatedItem = await updateFunction(item.id, folderId)

    // setStateFunction((items: any) =>
    //   items.map((item: any) =>
    //     item.id === updatedItem.id ? updatedItem : item
    //   )
    // )
  }

  const handleDragEnter = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    setIsDragOver(true)
  }

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    setIsDragOver(false)
  }

  const handleDragStart = (e: React.DragEvent<HTMLDivElement>, id: string) => {
    e.dataTransfer.setData("text/plain", id)
  }

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
  }

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()

    const target = e.target as Element

    if (!target.closest("#folder")) {
      const itemId = e.dataTransfer.getData("text/plain")
      // updateFolder(itemId, null)
    }

    setIsDragOver(false)
  }

  useEffect(() => {
    if (divRef.current) {
      setIsOverflowing(
        divRef.current.scrollHeight > divRef.current.clientHeight
      )
    }
  }, [data])

  // const dataWithFolders = data.filter(item => item.folder_id)
  // const dataWithoutFolders = data.filter(item => item.folder_id === null)

  const dataWithFolders: any[] = []
  const dataWithoutFolders: any[] = data

  return (
    <>
      <div
        ref={divRef}
        className="mt-2 flex flex-col overflow-auto"
        onDrop={handleDrop}
      >
        {data.length === 0 && (
          <div className="flex grow flex-col items-center justify-center">
            <div className=" text-centertext-muted-foreground p-8 text-lg italic">
              {t(`No ${contentType}.`)}
            </div>
          </div>
        )}

        {(dataWithFolders.length > 0 || dataWithoutFolders.length > 0) && (
          <div
            className={`h-full ${
              isOverflowing ? "w-[calc(100%-8px)]" : "w-full"
            } space-y-2 pt-2 ${isOverflowing ? "mr-2" : ""}`}
          >
            {folders.map(folder => (
              <Folder
                key={folder.id}
                folder={folder}
                onUpdateFolder={updateFolder}
                contentType={contentType}
              >
                {dataWithFolders
                  .filter(item => item.folder_id === folder.id)
                  .map(item => (
                    <div
                      key={item.id}
                      draggable
                      onDragStart={e => handleDragStart(e, item.id)}
                    >
                      {getDataListComponent(contentType, item)}
                    </div>
                  ))}
              </Folder>
            ))}

            {folders.length > 0 && <Separator />}

            {contentType === "chats" ? (
              <>
                {["Today", "Yesterday", "Previous Week", "Older"].map(
                  dateCategory => {
                    const sortedData = getSortedData(
                      dataWithoutFolders,
                      dateCategory as
                        | "Today"
                        | "Yesterday"
                        | "Previous Week"
                        | "Older"
                    )

                    return (
                      sortedData.length > 0 && (
                        <div key={dateCategory} className="pb-2">
                          <div className="text-muted-foreground mb-1 text-sm font-bold">
                            {t(dateCategory)}
                          </div>

                          <div
                            className={cn(
                              "flex grow flex-col",
                              isDragOver && "bg-accent"
                            )}
                            onDrop={handleDrop}
                            onDragEnter={handleDragEnter}
                            onDragLeave={handleDragLeave}
                            onDragOver={handleDragOver}
                          >
                            {sortedData.map((item: any) => (
                              <div
                                key={item.id}
                                draggable
                                onDragStart={e => handleDragStart(e, item.id)}
                              >
                                {getDataListComponent(contentType, item)}
                              </div>
                            ))}
                          </div>
                        </div>
                      )
                    )
                  }
                )}
              </>
            ) : (
              <div
                className={cn("flex grow flex-col", isDragOver && "bg-accent")}
                onDrop={handleDrop}
                onDragEnter={handleDragEnter}
                onDragLeave={handleDragLeave}
                onDragOver={handleDragOver}
              >
                {dataWithoutFolders.map(item => {
                  return (
                    <div
                      key={item.id}
                      draggable
                      onDragStart={e => handleDragStart(e, item.id)}
                    >
                      {getDataListComponent(contentType, item)}
                    </div>
                  )
                })}
              </div>
            )}
          </div>
        )}
      </div>

      <div
        className={cn("flex grow", isDragOver && "bg-accent")}
        onDrop={handleDrop}
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
        onDragOver={handleDragOver}
      />
    </>
  )
}
