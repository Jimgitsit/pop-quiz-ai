import {FC} from 'react'
import {MsgProps} from './ChatArea'

const AgentMsg: FC<MsgProps> = (props: MsgProps) => {
  return (
    <div className="msg agentMsg">
      <span className='new-line'>{props.msg}</span>
    </div>
  )
}

export default AgentMsg
