import {FC} from 'react'
import {MsgProps} from './ChatArea'
import ReactMarkdown from "react-markdown";
import remarkGfm from 'remark-gfm'

const AgentMsg: FC<MsgProps> = (props: MsgProps) => {
  return (
    <div className="msg agentMsg">
      <ReactMarkdown remarkPlugins={[remarkGfm]}>{props.msg}</ReactMarkdown>
    </div>
  )
}

export default AgentMsg
