import {FC} from 'react'
import {MsgProps} from './ChatArea'

const AgentMsg: FC<MsgProps> = (props: MsgProps) => {
  return (
    <div className="msg agentMsg">
      <p className='new-line'>{props.msg}</p>
    </div>
  )
}

export default AgentMsg
