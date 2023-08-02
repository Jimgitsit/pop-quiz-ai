import {FC, useState} from 'react'
import AgentMsg from './AgentMsg'
import UserMsg from './UserMsg'

const ChatArea: FC = () => {
  
  const [msgHistory] = useState([])
  
  // Iterate over history and display each message
  msgHistory.map((msg: string) => {
    console.log(msg)
  })
  
  return (
    <div>
      <AgentMsg msg="Hi" />
      <UserMsg msg="Hello" />
    </div>
  )
}

export default ChatArea
