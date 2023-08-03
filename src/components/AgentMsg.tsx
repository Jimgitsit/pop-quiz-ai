import {FC} from 'react'
import {MsgProps} from './ChatArea'

const AgentMsg: FC<MsgProps> = (props: MsgProps) => {
  return (
    <div className="msg agentMsg">
      <p>{props.msg}</p>
    </div>
  )
}

export default AgentMsg
