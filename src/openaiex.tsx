import {ChatCompletionRequestMessage, Configuration, OpenAIApi} from 'openai'

interface Message {
  prompt: string,
  completion: string
}

const configuration = new Configuration({
  apiKey: import.meta.env.VITE_OPENAI_API_KEY,
})

const openai = new OpenAIApi(configuration)
const gptModel: string = "gpt-3.5-turbo"
const history: Message[] = []
let initPrompt = "I want you to quiz me on the content of the [subject]. Act as a teacher and an expert on [subject]. You will generate and ask me one question about [subject]. When I answer you will tell me if I'm correct or not. No need to repeat the answer unless you can provide more information relevant to the subject. If my answer was not correct, you will tell me what the correct answer is and why I was wrong. If I answer incorrectly, ask if I would like you to clarify or provide an example before continuing with the quiz. The question type will be either multiple choice, true or false, fill in the blank, or short answer chosen by random. After your response you will ask another question using one of the four types chosen by random. You will continue asking questions until I tell you to stop. Do not repeat questions you have already asked. Do not provide a summary of the [subject]. Begin with 'Great, [subject] it is! Let's begin with some questions. Feel free to interrupt at any time and ask for clarification or more information.' then ask the first question. Never ask if I would like another question, just ask the next question."

/**
 * Assembles the messages from the history to send to OpenAI.
 *
 * @param newPrompt The new prompt to send to append to the history prior to completion.
 */
const getRequestMessages = (newPrompt: string) => {
  const messages = []
  
  if (history.length > 0) {
    initPrompt += " [subject] is " + newPrompt + "."
  }
  messages.push({role: "system", content: initPrompt})
  
  for (const msg of history) {
    messages.push({role: "user", content: msg.prompt})
    messages.push({role: "assistant", content: msg.completion})
  }
  messages.push({role: "user", content: newPrompt})
  return messages
}

/**
 * Gets a completion from OpenAI. The entire history is sent for context.
 *
 * @param newPrompt
 */
export const getCompletion = async (newPrompt: string): Promise<string> => {
  const messages = getRequestMessages(newPrompt)
  
  try {
    const completion = await openai.createChatCompletion({
      model: gptModel,
      messages: messages as ChatCompletionRequestMessage[],
      temperature: 0,
      max_tokens: 500
    })

    //console.log("completionText: ", completionText)
    const completionText = completion.data.choices[0].message?.content?.replace(/^"+/, '').replace(/"+$/, '')
    if (completionText !== undefined) {
      history.push({prompt: newPrompt, completion: completionText})
      return completionText
    } else {
      return ''
    }
  } catch (error) {
    console.log("error: ", error)
    return "Sorry, something is wrong. Please try again."
  }
}

// TODO: Streaming version of getCompletion
/*
export const getCompletionStream = async (newPrompt: string): Promise<string> => {
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