import { ChatbotUIContext } from "@/context/context"
import useHotkey from "@/lib/hooks/use-hotkey"
import { LLM_LIST } from "@/lib/models/llm/llm-list"
import { LLMID, Presets } from "@/types"
import { IconChevronDown } from "@tabler/icons-react"
import { FC, useContext, useEffect, useRef, useState } from "react"
import { useTranslation } from "react-i18next"
import { ModelIcon } from "../models/model-icon"
import { Button } from "../ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger
} from "../ui/dropdown-menu"
import { Input } from "../ui/input"
import { QuickSettingOption } from "./quick-setting-option"

interface QuickSettingsProps {}

type Direction = "ltr" | "rtl"

export const QuickSettings: FC<QuickSettingsProps> = ({}) => {
  const { t } = useTranslation()
  const { dir } = useContext(ChatbotUIContext)

  useHotkey("p", () => setIsOpen(prevState => !prevState))

  const {
    presets,
    selectedPreset,
    chatSettings,
    setSelectedPreset,
    setChatSettings
  } = useContext(ChatbotUIContext)

  const inputRef = useRef<HTMLInputElement>(null)

  const [isOpen, setIsOpen] = useState(false)
  const [search, setSearch] = useState("")

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => {
        inputRef.current?.focus()
      }, 100) // FIX: hacky
    }
  }, [isOpen])

  const handleSelectQuickSetting = async (item: Presets) => {
    setSelectedPreset(item as Presets)

    setChatSettings({
      model: item.model as LLMID,
      prompt: item.prompt,
      temperature: item.temperature,
      contextLength: item.context_length,
      imageSize: "1024x1024"
    })
  }

  const checkIfModified = () => {
    if (!chatSettings) return false

    if (selectedPreset) {
      if (
        selectedPreset.context_length !== chatSettings.contextLength ||
        selectedPreset.model !== chatSettings.model ||
        selectedPreset.prompt !== chatSettings.prompt ||
        selectedPreset.temperature !== chatSettings.temperature
      ) {
        return true
      }
    }

    return false
  }

  const isModified = checkIfModified()

  const modelDetails = LLM_LIST.find(
    model => model.modelId === selectedPreset?.model
  )

  return (
    <DropdownMenu
      open={isOpen}
      dir={dir as Direction}
      onOpenChange={isOpen => {
        setIsOpen(isOpen)
        setSearch("")
      }}
    >
      <DropdownMenuTrigger asChild className="max-w-[400px]">
        <Button
          variant="ghost"
          className="flex space-x-3 text-lg rtl:space-x-reverse"
        >
          {selectedPreset && (
            <ModelIcon
              provider={modelDetails?.provider || "custom"}
              width={32}
              height={32}
            />
          )}
          <div className="overflow-hidden text-ellipsis">
            {isModified && selectedPreset && "Modified "}
            {selectedPreset?.name || t("Quick Settings")}
          </div>

          <IconChevronDown className="ml-1" />
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent
        className="min-w-[300px] max-w-[500px] space-y-4"
        align="start"
      >
        {presets.length === 0 ? (
          <div className="p-8 text-center">{t("No items found.")}</div>
        ) : (
          <>
            <Input
              ref={inputRef}
              className="w-full"
              placeholder={t("Search...")}
              value={search}
              onChange={e => setSearch(e.target.value)}
              onKeyDown={e => e.stopPropagation()}
            />

            {!!selectedPreset && (
              <QuickSettingOption
                isSelected={true}
                item={selectedPreset}
                onSelect={() => {
                  setSelectedPreset(null)
                }}
              />
            )}

            {presets
              .filter(
                preset =>
                  preset.name.toLowerCase().includes(search.toLowerCase()) &&
                  preset.id !== selectedPreset?.id
              )
              .map(preset => (
                <QuickSettingOption
                  key={preset.id}
                  isSelected={false}
                  item={preset}
                  onSelect={() => handleSelectQuickSetting(preset)}
                />
              ))}
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
