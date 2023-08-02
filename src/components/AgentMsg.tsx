import {FC} from 'react'
import Props from './Props'

const AgentMsg: FC<Props> = (props: Props) => {
  return (
    <div>
      <p>{props.msg}</p>
    </div>
  )
}

export default AgentMsg
