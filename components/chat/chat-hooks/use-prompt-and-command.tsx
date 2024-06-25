import { ChatbotUIContext } from "@/context/context"
import { useContext } from "react"
import { Prompts } from "@/types"

export const usePromptAndCommand = () => {
  const { userInput, setUserInput, setIsPromptPickerOpen, setSlashCommand } =
    useContext(ChatbotUIContext)

  const handleInputChange = (value: string) => {
    const slashTextRegex = /\/([^ ]*)$/
    const slashMatch = value.match(slashTextRegex)

    if (slashMatch) {
      setIsPromptPickerOpen(true)
      setSlashCommand(slashMatch[1])
    } else {
      setIsPromptPickerOpen(false)
      setSlashCommand("")
    }

    setUserInput(value)
  }

  const handleSelectPrompt = (prompt: Prompts) => {
    setIsPromptPickerOpen(false)
    setUserInput(userInput.replace(/\/[^ ]*$/, "") + prompt.content)
  }

  return {
    handleInputChange,
    handleSelectPrompt
  }
}
