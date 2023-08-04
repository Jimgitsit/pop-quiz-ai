import {FC} from 'react'
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
  return (
    <div id="chat">
      {
        // Display the message history
        props.msgHistory.map((msg: Msg, index: number) => {
          if (msg.type === 'agent') {
            return <AgentMsg key={index} msg={msg.msg} />
          }
          else if (msg.type === 'user') {
            return <UserMsg key={index} msg={msg.msg} />
          }
        })
      }
    </div>
  )
}

export default ChatArea
