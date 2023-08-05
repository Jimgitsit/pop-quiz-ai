import {ChatCompletionRequestMessage, Configuration, OpenAIApi} from 'openai'

export interface Message {
  prompt: string,
  completion: string
}

/**
 * Wrapper for the OpenAI API. Contains optional pre-training prompt and history for continuous context.
 */
export default class OpenAIEx {
  openai: OpenAIApi | null = null
  gptModel: string = "gpt-3.5-turbo"
  history: Message[] = []
  initPrompt = ""
  
  constructor() {
    const configuration = new Configuration({
      apiKey: import.meta.env.VITE_OPENAI_API_KEY,
    })
    this.openai = new OpenAIApi(configuration)
  }
  
  /**
   * Sets the initial pre-training prompt to send to OpenAI.
   * @param prompt
   */
  setInitPrompt = (prompt: string) => {
    this.initPrompt = prompt
  }
  
  /**
   * Sets the model to use with openai. Default is "gpt-3.5-turbo".
   * @param model
   */
  setModel = (model: string) => {
    this.gptModel = model
  }
  
  /**
   * Gets a completion from OpenAI. The entire history is sent for context.
   * @param newPrompt
   */
  getCompletion = async (newPrompt: string): Promise<string> => {
    const messages = this.formatMessages(newPrompt)
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
        // Add the new prompt to the history
        this.history.push({prompt: newPrompt, completion: completionText})
        return completionText
      } else {
        return ''
      }
    } catch (error) {
      console.log("error: ", error)
      console.log("completion: ", completion)
      return "Sorry, something is wrong. Please try again."
    }
  }
  
  /**
   * Assembles the messages to send to OpenAI from the inti prompt and history.
   * @param newPrompt A new prompt to send to append to the messages prior to completion.
   */
  private formatMessages = (newPrompt: string) => {
    const messages = []
    
    if (history.length > 0) {
      this.initPrompt += " [subject] is " + newPrompt + "."
    }
    messages.push({role: "system", content: this.initPrompt})
    
    for (const msg of this.history) {
      messages.push({role: "user", content: msg.prompt})
      messages.push({role: "assistant", content: msg.completion})
    }
    messages.push({role: "user", content: newPrompt})
    return messages
  }

  // TODO: Streaming version of getCompletion
  /*
  getCompletionStream = async (newPrompt: string): Promise<string> => {
    const messages = getRequestMessages(newPrompt)
    
    const completion = await openai.createChatCompletion({
      model: gptModel,
      messages: messages as ChatCompletionRequestMessage[],
      temperature: 0,
      max_tokens: 500,
      stream: true
    })
    
    /*
    const response = await openai.createCompletion({
      model: "text-davinci-003",
      prompt: "The following is a conversation with an AI assistant. The assistant is helpful, creative, clever, and very friendly.\n\nHuman: Hello, who are you?\nAI: I am an AI created by OpenAI. How can I help you today?\nHuman: ",
      temperature: 0.9,
      max_tokens: 150,
      top_p: 1,
      frequency_penalty: 0,
      presence_penalty: 0.6,
      stop: [" Human:", " AI:"],
    })
    */
  
    /*
    return new Promise((resolve) => {
      let result = ""
      completionText.data.on("data", (data) => {
        const lines = data
          ?.toString()
          ?.split("\n")
          .filter((line) => line.trim() !== "")
        for (const line of lines) {
          const message = line.replace(/^data: /, "")
          if (message === "[DONE]") {
            resolve(result)
          } else {
            let token
            try {
              token = JSON.parse(message)?.choices?.[0]?.text
            } catch {
              console.log("ERROR", json)
            }
            result += token
            if (token) {
              callback(token)
            }
          }
        }
      })
    })
    *
  }
  */
}

