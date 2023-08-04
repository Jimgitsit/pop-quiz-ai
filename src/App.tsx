import './App.css'
import ChatArea from "./components/ChatArea.tsx";
import UserInput from "./components/UserInput.tsx";
import {useState} from "react";

export interface Msg {
  type: string,
  msg: string
}

function App() {
  const [msgHistory, setMsgHistory] = useState<Msg[]>([])
  
  // TODO: Init and pre-train openai
  
  // Always keep focus on the input
  window.addEventListener('click', () => {
    const input = document.getElementsByName('userInput')[0] as HTMLInputElement
    input !== null ? input.focus() : null
  })
  
  return (
    <>
      <div id="greeting">
        <p>What subject would you like to learn about?</p>
      </div>
      <ChatArea msgHistory={msgHistory} />
      <UserInput msgHistory={msgHistory} setMsgHistory={setMsgHistory} />
    </>
  )
}

export default App
