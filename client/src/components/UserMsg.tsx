import {FC} from 'react'
import {MsgProps} from './ChatArea'

const UserMsg: FC<MsgProps> = (props: MsgProps) => {
  return (
    <div className="msg userMsg">
      {props.msg}
    </div>
  )
}

export default UserMsg
