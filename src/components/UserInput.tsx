import {FC, useState} from 'react'
import {useRef} from 'react'

const UserInput: FC = () => {
  const [msgHistory, setMsgHistory] = useState<string[]>([])
  const userInput = useRef<HTMLInputElement>(null)
  
  const submitInput = () => {
    const newMsg = (document.getElementsByName('userInput')[0] as HTMLInputElement).value
    console.log('newMsg: ', newMsg)
    const newHistory = [...msgHistory, newMsg]
    setMsgHistory(newHistory)
    console.log('msgHistory: ', msgHistory)
    userInput.current !== null ? userInput.current.value = '' : null
  }
  
  return (
    <div>
      <input name="userInput" ref={userInput} />
      <button onClick={submitInput}>Submit</button>
    </div>
  )
}

export default UserInput
