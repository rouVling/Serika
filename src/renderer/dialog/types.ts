export interface DialogMessage {
  content: string,
  role: "user" | "assistant" | "system",
  voiceUrl? : undefined | string | HTMLAudioElement,
  voiceType?: "string" | "element"
}

export interface GPTResponse {
  id: string,
  object: string,
  created: number,
  model: string,
  choices: {
    index: number,
    message: {
      role: "assistant" | "user",
      content: string,
    },
    logprobs: null,
    finish_reason: "length" | "stop",
  }[],
  usage:
  {
    prompt_tokens: number,
    completion_tokens: number,
    total_tokens: number,
  }
}

export interface GeminiResponse {
  candidates: {
    content: {
      parts?: {
        text: string
      }[],
      role: "model" | "user"
    },
    finishReason: string,
    index: number,
    safetyRatings: {
      category: string, // unknown options
      probability: string // unknown options
    }[]
  } [],
  usageMetadata: {
    promptTokenCount: number,
    candidatesTokenCount: number,
    totalTokenCount: number
  }
}