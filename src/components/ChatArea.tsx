import {FC, useEffect} from 'react'
import AgentMsg from './AgentMsg'
import UserMsg from './UserMsg'
import {Msg} from '../App'

export interface ChatProps {
  msgHistory: Msg[]
}

export interface MsgProps {
  msg: string
}

const ChatArea: FC<ChatProps> = (props: ChatProps) => {
  
  const onUserInput = () => {
    console.log('msgHistory: ', props.msgHistory)
  }
  useEffect(onUserInput, [props.msgHistory])
  
  return (
    <div id="chat">
      {
        // Display message history
        props.msgHistory.map((msg: Msg) => {
          if (msg.type === 'agent') {
            return <AgentMsg msg={msg.msg} />
          }
          else if (msg.type === 'user') {
            return <UserMsg msg={msg.msg} />
          }
        })
      }
    </div>
  )
}

export default ChatArea
