import { ModelIcon } from "@/components/models/model-icon"
import { ChatSettingsForm } from "@/components/ui/chat-settings-form"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { PRESET_NAME_MAX } from "@/prisma/limits"
import { LLM_LIST } from "@/lib/models/llm/llm-list"
import { FC, useState } from "react"
import { useTranslation } from "react-i18next"
import { Presets } from "@/types"
import { SidebarItem } from "../all/sidebar-display-item"

interface PresetItemProps {
  preset: Presets
}

export const PresetItem: FC<PresetItemProps> = ({ preset }) => {
  const { t } = useTranslation()
  const [name, setName] = useState(preset.name)
  const [isTyping, setIsTyping] = useState(false)
  const [presetChatSettings, setPresetChatSettings] = useState({
    model: preset.model,
    prompt: preset.prompt,
    temperature: preset.temperature,
    contextLength: preset.context_length
  })

  const modelDetails = LLM_LIST.find(model => model.modelId === preset.model)

  return (
    <SidebarItem
      item={preset}
      isTyping={isTyping}
      contentType="presets"
      icon={
        <ModelIcon
          provider={modelDetails?.provider || "custom"}
          height={30}
          width={30}
        />
      }
      updateState={{
        name,
        context_length: presetChatSettings.contextLength,
        model: presetChatSettings.model,
        prompt: presetChatSettings.prompt,
        temperature: presetChatSettings.temperature
      }}
      renderInputs={() => (
        <>
          <div className="space-y-1">
            <Label>{t("Name")}</Label>

            <Input
              placeholder={t("Preset name...")}
              value={name}
              onChange={e => setName(e.target.value)}
              maxLength={PRESET_NAME_MAX}
            />
          </div>

          <ChatSettingsForm
            chatSettings={presetChatSettings as any}
            onChangeChatSettings={setPresetChatSettings}
            useAdvancedDropdown={true}
          />
        </>
      )}
    />
  )
}
