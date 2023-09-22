import {
  ChatCompletionRequestMessage,
  Configuration,
  CreateChatCompletionResponse,
  OpenAIApi
} from 'openai'
import {AxiosError, AxiosResponse} from "axios";
import dotenv from 'dotenv'
dotenv.config()

export interface Message {
  type: string,
  msg: string
}

export interface CompletionResponse {
  error: string,
  completionText: string
  completion: AxiosResponse<CreateChatCompletionResponse> | null
}

/**
 * Wrapper for the OpenAI API.
 */
export default class OpenAIEx {
  openai: OpenAIApi | null = null
  gptModel = process.env.OPENAI_MODEL || "gpt-3.5-turbo"
  systemPrompt = ""
  
  /**
   * Initializes the OpenAI API with the API key from the environment.
   */
  constructor() {
    const configuration = new Configuration({
      apiKey: process.env.OPENAI_API_KEY,
    })
    this.openai = new OpenAIApi(configuration)
  }
  
  /**
   * Sets the initial pre-training prompt to send to OpenAI.
   * @param prompt
   */
  setInitPrompt = (prompt: string) => {
    this.systemPrompt = prompt
  }
  
  /**
   * Gets a completion from OpenAI. The entire history is sent for context.
   * @param newPrompt The new prompt to append to the history.
   * @param history Optional history of prompts and completions.
   */
  getCompletion = async (newPrompt: string, history: Message[] | null = null): Promise<CompletionResponse> => {
    const messages = this.formatMessages(newPrompt, history)
    let completion = null
    
    if (this.openai === null)
      throw new Error("OpenAI is not initialized.")
    
    try {
      completion = await this.openai.createChatCompletion({
        model: this.gptModel,
        messages: messages as ChatCompletionRequestMessage[],
        temperature: 0,
        max_tokens: 500
      })
      
      const completionText = completion.data.choices[0].message?.content?.replace(/^"+/, '').replace(/"+$/, '')
      if (completionText !== undefined) {
        return {
          error: '',
          completionText: completionText,
          completion: {status: completion.status, statusText: completion.statusText, data: completion.data} as AxiosResponse<CreateChatCompletionResponse>,
        }
      } else {
        return {
          error: 'Error: Did not receive completion text.',
          completionText: '',
          completion: null,
        }
      }
    } catch (error) {
      console.log("error: ", error)
      console.log("completion: ", completion)
      let msg = 'Something bad happened.'
      if (error instanceof AxiosError && error.response !== undefined) {
        msg += ' ' + error.message + error.response.statusText
      }
      return {
        error: msg,
        completionText: '',
        completion: {status: completion?.status, statusText: completion?.statusText, data: completion?.data} as AxiosResponse<CreateChatCompletionResponse>,
      }
    }
  }
  
  /**
   * Assembles the messages to send to OpenAI from the inti prompt and history.
   * @param newPrompt A new prompt to send to append to the messages prior to completion.
   * @param history A history of prompts and completions (not including the new prompt).
   */
  private formatMessages = (newPrompt: string, history: Message[] | null = null) => {
    const messages = []
    
    // Add the system prompt
    messages.push({role: "system", content: this.systemPrompt})
    
    // Add the history
    if (history !== null) {
      for (const msg of history) {
        msg.type === 'user' ? messages.push({role: "user", content: msg.msg}) : null
        msg.type === 'agent' ? messages.push({role: "assistant", content: msg.msg}) : null
      }
    }
    
    // Add the new prompt
    messages.push({role: "user", content: newPrompt})
    return messages
  }
}
