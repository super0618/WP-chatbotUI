import { LLM, LLMID, OpenRouterLLM } from "@/types"
import { toast } from "sonner"
import { LLM_LIST_MAP } from "./llm/llm-list"

export const fetchHostedModels = async () => {
  try {
    const providers = {
      openai: process.env.OPENAI_API_KEY,
      google: process.env.GOOGLE_GEMINI_API_KEY,
      anthropic: process.env.ANTHROPIC_API_KEY,
      mistral: process.env.MISTRAL_API_KEY,
      perplexity: process.env.PERPLEXITY_API_KEY
    }

    let modelsToAdd: LLM[] = []

    for (const [provider, api_key] of Object.entries(providers)) {
      if (api_key) {
        const models = LLM_LIST_MAP[provider]

        if (Array.isArray(models)) {
          modelsToAdd.push(...models)
        }

        if (provider == "openai") {
          modelsToAdd.push(...LLM_LIST_MAP["image"])
        }
      }
    }

    return { hostedModels: modelsToAdd }
  } catch (error) {
    console.warn("Error fetching hosted models: " + error)
  }
}

export const fetchOpenRouterModels = async () => {
  try {
    const response = await fetch("https://openrouter.ai/api/v1/models")

    if (!response.ok) {
      throw new Error(`OpenRouter server is not responding.`)
    }

    const { data } = await response.json()

    const openRouterModels = data.map(
      (model: {
        id: string
        name: string
        context_length: number
      }): OpenRouterLLM => ({
        modelId: model.id as LLMID,
        modelName: model.id,
        provider: "openrouter",
        hostedId: model.name,
        platformLink: "https://openrouter.dev",
        imageInput: false,
        maxContext: model.context_length
      })
    )

    return openRouterModels
  } catch (error) {
    console.error("Error fetching Open Router models: " + error)
    toast.error("Error fetching Open Router models: " + error)
  }
}
