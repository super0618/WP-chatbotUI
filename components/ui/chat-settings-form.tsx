"use client"

import { ChatbotUIContext } from "@/context/context"
import { CHAT_SETTING_LIMITS } from "@/lib/chat-setting-limits"
import { Button } from "@/components/ui/button"
import { ChatSettings } from "@/types"
import { FC, useContext, useRef, useState } from "react"
import { ModelSelect } from "../models/model-select"
import { AdvancedSettings } from "./advanced-settings"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger
} from "./dropdown-menu"
import { Label } from "./label"
import { Slider } from "./slider"
import { useTranslation } from "react-i18next"
import { TextareaAutosize } from "./textarea-autosize"
import { IconChevronDown } from "@tabler/icons-react"

interface OptionItemProps {
  label: string
  dir: string
  onClick: () => void
}

const OptionItem = ({ label, dir, onClick }: OptionItemProps) => {
  return (
    <div
      className="hover:bg-accent cursor-pointer truncate rounded p-2 hover:opacity-50"
      onClick={onClick}
      dir={dir}
    >
      {label}
    </div>
  )
}

interface ChatSettingsFormProps {
  chatSettings: ChatSettings
  onChangeChatSettings: (value: ChatSettings) => void
  useAdvancedDropdown?: boolean
  showTooltip?: boolean
}

export const ChatSettingsForm: FC<ChatSettingsFormProps> = ({
  chatSettings,
  onChangeChatSettings,
  useAdvancedDropdown = true,
  showTooltip = true
}) => {
  const { t } = useTranslation()
  const { dir } = useContext(ChatbotUIContext)

  return (
    <div className="space-y-3" dir={dir}>
      <div className="space-y-1">
        <Label>{t("Model")}</Label>

        <ModelSelect
          selectedModelId={chatSettings.model}
          onSelectModel={model => {
            onChangeChatSettings({ ...chatSettings, model })
          }}
        />
      </div>

      <div className="space-y-1">
        <Label>{t("Prompt")}</Label>

        <TextareaAutosize
          className="bg-background border-input border-2"
          placeholder={t("You are a helpful AI assistant.")}
          onValueChange={prompt => {
            onChangeChatSettings({ ...chatSettings, prompt })
          }}
          value={chatSettings.prompt}
          minRows={3}
          maxRows={6}
        />
      </div>

      {useAdvancedDropdown ? (
        <AdvancedSettings>
          <AdvancedContent
            chatSettings={chatSettings}
            onChangeChatSettings={onChangeChatSettings}
            showTooltip={showTooltip}
          />
        </AdvancedSettings>
      ) : (
        <div>
          <AdvancedContent
            chatSettings={chatSettings}
            onChangeChatSettings={onChangeChatSettings}
            showTooltip={showTooltip}
          />
        </div>
      )}
    </div>
  )
}

interface AdvancedContentProps {
  chatSettings: ChatSettings
  onChangeChatSettings: (value: ChatSettings) => void
  showTooltip: boolean
}

const AdvancedContent: FC<AdvancedContentProps> = ({
  chatSettings,
  onChangeChatSettings
}) => {
  const { t } = useTranslation()
  const { dir, availableOpenRouterModels } = useContext(ChatbotUIContext)
  const selImgRef = useRef<any>()
  const [isImgSizeOpen, setIsImgSizeOpen] = useState(false)

  const onSelectImgSize = (imgSize: any) => {
    onChangeChatSettings({
      ...chatSettings,
      imageSize: imgSize
    })
    setIsImgSizeOpen(false)
  }

  function findOpenRouterModel(modelId: string) {
    return availableOpenRouterModels.find(model => model.modelId === modelId)
  }

  const MODEL_LIMITS = CHAT_SETTING_LIMITS[chatSettings.model] || {
    MIN_TEMPERATURE: 0,
    MAX_TEMPERATURE: 1,
    MAX_CONTEXT_LENGTH:
      findOpenRouterModel(chatSettings.model)?.maxContext || 4096
  }

  return (
    <div className="mt-5">
      <div className="space-y-3">
        <Label className="flex items-center space-x-1 rtl:space-x-reverse">
          <div>{`${t("Temperature")}:`}</div>

          <div>{chatSettings.temperature}</div>
        </Label>

        <Slider
          value={[chatSettings.temperature]}
          onValueChange={temperature => {
            onChangeChatSettings({
              ...chatSettings,
              temperature: temperature[0]
            })
          }}
          min={MODEL_LIMITS.MIN_TEMPERATURE}
          max={MODEL_LIMITS.MAX_TEMPERATURE}
          step={0.01}
        />
      </div>

      <div className="mt-6 space-y-3">
        <Label className="flex items-center space-x-1 rtl:space-x-reverse">
          <div>{`${t("Context Length")}:`}</div>

          <div>{chatSettings.contextLength}</div>
        </Label>

        <Slider
          value={[chatSettings.contextLength]}
          onValueChange={contextLength => {
            onChangeChatSettings({
              ...chatSettings,
              contextLength: contextLength[0]
            })
          }}
          min={0}
          max={MODEL_LIMITS.MAX_CONTEXT_LENGTH}
          step={1}
        />
      </div>

      {chatSettings.model === "dall-e-3" ? (
        <div className="mt-6 space-y-3">
          <Label className="flex items-center space-x-1 rtl:space-x-reverse">
            <div>{t("Image Size")}</div>
          </Label>
          <DropdownMenu open={isImgSizeOpen} onOpenChange={setIsImgSizeOpen}>
            <DropdownMenuTrigger asChild>
              <Button
                ref={selImgRef}
                className="mb-4 flex w-full items-center justify-between"
                variant="outline"
              >
                <div className="flex items-center">
                  {chatSettings.imageSize
                    ? chatSettings.imageSize
                    : "1024x1024"}
                </div>
                <IconChevronDown />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              align="start"
              style={{ width: selImgRef?.current?.offsetWidth }}
            >
              <div className="max-h-[300px] overflow-auto">
                {["1024x1024", "1024x1792", "1792x1024"].map((imgSize: any) => (
                  <OptionItem
                    key={imgSize}
                    label={imgSize}
                    dir={dir}
                    onClick={() => onSelectImgSize(imgSize)}
                  />
                ))}
              </div>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      ) : null}
    </div>
  )
}
