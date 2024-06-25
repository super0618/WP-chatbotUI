import { SidebarCreateItem } from "@/components/sidebar/items/all/sidebar-create-item"
import { ChatSettingsForm } from "@/components/ui/chat-settings-form"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ChatbotUIContext } from "@/context/context"
import { PRESET_NAME_MAX } from "@/prisma/limits"
import { Presets } from "@/types"
import { FC, useContext, useState } from "react"
import { useTranslation } from "react-i18next"

interface CreatePresetProps {
  isOpen: boolean
  onOpenChange: (isOpen: boolean) => void
}

export const CreatePreset: FC<CreatePresetProps> = ({
  isOpen,
  onOpenChange
}) => {
  const { t } = useTranslation()
  const { profile } = useContext(ChatbotUIContext)

  const [name, setName] = useState("")
  const [isTyping, setIsTyping] = useState(false)
  const [presetChatSettings, setPresetChatSettings] = useState({
    model: "gpt-3.5-turbo",
    prompt: "You are a helpful AI assistant.",
    temperature: 0.5,
    contextLength: 4000
  })

  return (
    <SidebarCreateItem
      contentType="presets"
      isOpen={isOpen}
      isTyping={isTyping}
      onOpenChange={onOpenChange}
      createState={
        {
          user_id: profile.ID,
          name,
          context_length: presetChatSettings.contextLength,
          model: presetChatSettings.model,
          prompt: presetChatSettings.prompt,
          temperature: presetChatSettings.temperature
        } as Presets
      }
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
