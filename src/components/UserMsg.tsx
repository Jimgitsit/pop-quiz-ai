import {FC} from 'react'
import {MsgProps} from './ChatArea'

const UserMsg: FC<MsgProps> = (props: MsgProps) => {
  return (
    <div className="msg userMsg">
      <p>{props.msg}</p>
    </div>
  )
}

export default UserMsg
