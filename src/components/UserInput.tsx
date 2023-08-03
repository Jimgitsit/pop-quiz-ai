import React, {FC} from 'react'
import {useRef} from 'react'
import {Msg} from '../App'

interface Props {
  msgHistory: Msg[],
  setMsgHistory: React.Dispatch<React.SetStateAction<Msg[]>>
}

const UserInput: FC<Props> = (props: Props) => {
  
  const userInput = useRef<HTMLInputElement>(null)
  
  const handleInputKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      submitInput()
    }
  }
  
  const submitInput = () => {
    const newMsg = (document.getElementsByName('userInput')[0] as HTMLInputElement).value
    let msgHistory = [...props.msgHistory, {type: 'user', msg: newMsg}]
    props.setMsgHistory(msgHistory)
    userInput.current !== null ? userInput.current.value = '' : null
    
    // TODO: Get completion from openai and add to msgHistory
    setTimeout(() => {
      msgHistory = [...msgHistory, {type: 'agent', msg: 'This is the response/completion.'}]
      props.setMsgHistory(msgHistory)
    }, 2000)
  }
  
  return (
    <div id="inputWrap">
      <input name="userInput" ref={userInput} onKeyDown={handleInputKeyDown} autoFocus />
    </div>
  )
}

export default UserInput
