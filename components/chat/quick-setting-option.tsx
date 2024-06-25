import { LLM_LIST } from "@/lib/models/llm/llm-list"
import { IconCircleCheckFilled } from "@tabler/icons-react"
import { FC } from "react"
import { ModelIcon } from "../models/model-icon"
import { Presets } from "@/types"
import { DropdownMenuItem } from "../ui/dropdown-menu"

interface QuickSettingOptionProps {
  isSelected: boolean
  item: Presets
  onSelect: () => void
}

export const QuickSettingOption: FC<QuickSettingOptionProps> = ({
  isSelected,
  item,
  onSelect
}) => {
  const modelDetails = LLM_LIST.find(model => model.modelId === item.model)

  return (
    <DropdownMenuItem
      tabIndex={0}
      className="cursor-pointer items-center"
      onSelect={onSelect}
    >
      <div className="w-[32px]">
        <ModelIcon
          provider={modelDetails?.provider || "custom"}
          width={32}
          height={32}
        />
      </div>

      <div className="mx-4 flex grow flex-col space-y-1">
        <div className="text-md font-bold">{item.name}</div>
      </div>

      <div className="min-w-[40px]">
        {isSelected ? (
          <IconCircleCheckFilled className="ml-4" size={20} />
        ) : null}
      </div>
    </DropdownMenuItem>
  )
}
