"use client"

import { ChatbotUIContext } from "@/context/context"
import { Sidebar } from "@/components/sidebar/sidebar"
import { SidebarSwitcher } from "@/components/sidebar/sidebar-switcher"
import { Button } from "@/components/ui/button"
import { Tabs } from "@/components/ui/tabs"
import useHotkey from "@/lib/hooks/use-hotkey"
import { cn } from "@/lib/utils"
import { ContentType } from "@/types"
import { IconChevronCompactRight } from "@tabler/icons-react"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { FC, useState, useContext } from "react"
import { CommandK } from "../utility/command-k"

export const SIDEBAR_WIDTH = 350

type Direction = "ltr" | "rtl"
interface DashboardProps {
  children: React.ReactNode
}

export const Dashboard: FC<DashboardProps> = ({ children }) => {
  useHotkey("s", () => setShowSidebar(prevState => !prevState))

  const pathname = usePathname()
  const router = useRouter()
  const searchParams = useSearchParams()
  const tabValue = searchParams.get("tab") || "chats"
  const { dir } = useContext(ChatbotUIContext)

  const [contentType, setContentType] = useState<ContentType>(
    tabValue as ContentType
  )
  const [showSidebar, setShowSidebar] = useState(
    localStorage.getItem("showSidebar") === "true"
  )
  const handleToggleSidebar = () => {
    setShowSidebar(prevState => !prevState)
    localStorage.setItem("showSidebar", String(!showSidebar))
  }

  return (
    <div className="relative flex size-full">
      <CommandK />

      <Button
        className={cn(
          "absolute left-[4px] top-[50%] z-10 size-[32px] cursor-pointer"
        )}
        style={
          dir === "rtl"
            ? {
                right: showSidebar ? `${SIDEBAR_WIDTH}px` : "0px",
                transform: showSidebar ? "rotate(0deg)" : "rotate(180deg)"
              }
            : {
                left: showSidebar ? `${SIDEBAR_WIDTH}px` : "0px",
                transform: showSidebar ? "rotate(180deg)" : "rotate(0deg)"
              }
        }
        variant="ghost"
        size="icon"
        onClick={handleToggleSidebar}
      >
        <IconChevronCompactRight size={24} />
      </Button>

      <div
        className={cn("border-r-2 duration-200 dark:border-none")}
        style={{
          // Sidebar
          minWidth: showSidebar ? `${SIDEBAR_WIDTH}px` : "0px",
          maxWidth: showSidebar ? `${SIDEBAR_WIDTH}px` : "0px",
          width: showSidebar ? `${SIDEBAR_WIDTH}px` : "0px"
        }}
      >
        {showSidebar && (
          <Tabs
            dir={dir as Direction}
            className="flex h-full"
            value={contentType}
            onValueChange={tabValue => {
              setContentType(tabValue as ContentType)
              router.replace(`${pathname}?tab=${tabValue}`)
            }}
          >
            <SidebarSwitcher onContentTypeChange={setContentType} />

            <Sidebar contentType={contentType} showSidebar={showSidebar} />
          </Tabs>
        )}
      </div>

      <div className="bg-muted/50 flex grow flex-col">{children}</div>
    </div>
  )
}
