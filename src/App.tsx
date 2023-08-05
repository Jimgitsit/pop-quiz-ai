import './App.css'
import './lds-ellipsis.css'
import ChatArea from "./components/ChatArea.tsx";
import UserInput from "./components/UserInput.tsx";
import {useState} from "react";
import OpenAIEx from "./OpenAIEx.tsx";

// Init global OpenAIEx instance
const openAIEx = new OpenAIEx()
openAIEx.setModel("gpt-3.5-turbo")
openAIEx.setInitPrompt("I want you to quiz me on the content of the [subject]. Act as a teacher and an expert on [subject]. You will generate and ask me one question about [subject]. When I answer you will tell me if I'm correct or not. No need to repeat the answer unless you can provide more information relevant to the subject. If my answer was not correct, you will tell me what the correct answer is and why I was wrong. The question type will be either multiple choice, true or false, fill in the blank, or short answer chosen by random. Use a variety of question types. After your response you will ask another question using one of the four types chosen by random. You will continue asking questions until I tell you to stop. Do not repeat questions you have already asked. Respond with markdown when appropriate. Begin with 'Great, [subject] it is! Let's begin with some questions. Feel free to interrupt at any time and ask for clarification or more information.' then ask the first question. Do not provide a summary of the [subject]. Never ask if I would like another question, just ask the next question. Use a different question type from the last question.")

export interface Msg {
  type: string,
  msg: string
}

function App() {
  const [msgHistory, setMsgHistory] = useState<Msg[]>([])
  
  // Always keep focus on the input
  window.addEventListener('click', () => {
    const input = document.getElementsByName('userInput')[0] as HTMLInputElement
    input !== null ? input.focus() : null
  })
  
  return (
    <>
      <div id="greeting">
        <p>What subject would you like to learn more about?</p>
      </div>
      <ChatArea msgHistory={msgHistory} />
      <div id="ldsEllipsis" className="lds-ellipsis"><div></div><div></div><div></div><div></div></div>
      <UserInput msgHistory={msgHistory} setMsgHistory={setMsgHistory} openAIEx={openAIEx} />
    </>
  )
}

export default App
