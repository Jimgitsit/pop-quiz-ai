import React, {FC, useState} from 'react'
import {useRef} from 'react'
import {Msg} from '../App'
import axios from 'axios'

interface Props {
  msgHistory: Msg[],
  setMsgHistory: React.Dispatch<React.SetStateAction<Msg[]>>
}

const suggestions = [
  'The history of submarines',
  'Albert Einstein',
  'Thomas Edison',
  'The history of the internet',
  "Algebra",
  "Philosophy",
  "Basic HTML and CSS",
  "World War I",
  "Astronomy",
  "Economics",
  "Elementary Physics",
  "Organic Chemistry",
  "Classical Literature",
  "Human Anatomy",
  "Psychology",
  "Environmental Science",
  "French Language",
  "Statistical Methods",
  "Early American History",
  "Music Theory",
  "Robotics",
  "Photography Techniques",
  "Geology",
  "Sociology",
  "Astrophysics",
  "Quantum Mechanics",
  "Whales"
]

const UserInput: FC<Props> = (props: Props) => {
  const userInput = useRef<HTMLTextAreaElement>(null)
  
  const [totalPromptTokens, setTotalPromptTokens] = useState(0)
  const [totalCompletionTokens, setTotalCompletionTokens] = useState(0)
  const [totalTokens, setTotalTokens] = useState(0)
  
  const newSuggestion = () => {
    return suggestions[Math.floor(Math.random() * suggestions.length)] + ' (space to accept)'
  }
  
  const [suggestion, setSuggestion] = useState(newSuggestion())
  
  const handleInputKeyDown = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
    const input = document.getElementById('userInput') as HTMLTextAreaElement
    if (event.key === 'Enter') {
      submitInput()
    }
    else if (event.key === 'Backspace') {
      // if the input is empty
      if (input.value.length === 0) {
        // get a new suggestion
        setSuggestion(newSuggestion())
      }
    }
    else if (input.value.length === 0 && event.key === ' ') {
      acceptSuggestion(event)
    }
  }
  
  const onInput = (event: React.FormEvent<HTMLTextAreaElement>) => {
    // Copy the value to the replicatedValue attribute thereby causing the textarea to expand as needed
    ((event.target as HTMLTextAreaElement).parentNode as HTMLElement).dataset.replicatedValue =
      (event.target as HTMLTextAreaElement).value
  }
  
  const acceptSuggestion = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
    event.preventDefault()
    
    const prompt = suggestion.replace(' (space to accept)', '')
    userInput.current !== null ? userInput.current.value = prompt : null
  }
  
  const scrollToBottom = (bottomElement: HTMLElement) => {
    setTimeout(() => {
      bottomElement !== null ? bottomElement.scrollIntoView() : null
    }, 100)
  }
  
  const submitInput = () => {
    // Update the message history with the user's input
    const input = document.getElementById('userInput') as HTMLTextAreaElement
    const newPrompt = input.value
    let msgHistory = [...props.msgHistory, {type: 'user', msg: newPrompt}]
    props.setMsgHistory(msgHistory)
    userInput.current !== null ? userInput.current.value = '' : null
    
    // Hide the input
    const inputWrap = document.getElementById('inputWrap') as HTMLElement
    inputWrap !== null ? inputWrap.style.display = 'none' : null
    
    // Show the ellipsis
    const ellipsis = document.getElementById('ldsEllipsis') as HTMLElement
    ellipsis !== null ? ellipsis.style.display = 'block' : null
    
    // Scroll to bottom
    if (msgHistory.length > 1) {
      scrollToBottom(ellipsis)
    }
    
    // TODO: Check token limit
    // if (totalTokens >= import.meta.env.REACT_APP_MAX_TOKENS) {
    //
    // }
    
    // Call server for completion
    console.log('Calling API at ' + process.env.REACT_APP_API_HOST)
    axios.post(process.env.REACT_APP_API_HOST + '/getCompletion', {
        newPrompt: newPrompt,
        history: props.msgHistory
    }).then((response) => {
      if (response.status !== 200) {
        console.log('Error: ', response.data)
        msgHistory = [...props.msgHistory, {type: 'agent', msg: 'Error: ' + response.data.error}]
        props.setMsgHistory(msgHistory)
      } else {
        // Update the message history with the agent's response
        msgHistory = [...msgHistory, {type: 'agent', msg: response.data.completionText}]
        props.setMsgHistory(msgHistory)
        
        setTotalPromptTokens(totalPromptTokens + response.data.completion.data.usage.prompt_tokens)
        setTotalCompletionTokens(totalCompletionTokens + response.data.completion.data.usage.completion_tokens)
        setTotalTokens(totalTokens + response.data.completion.data.usage.total_tokens)
        
        console.log('model: ', response.data.completion.data.model)
        console.log('usage: ', response.data.completion.data.usage)
        console.log('totalPromptTokens: ', totalPromptTokens + response.data.completion.data.usage.prompt_tokens)
        console.log('totalCompletionTokens: ', totalCompletionTokens + response.data.completion.data.usage.completion_tokens)
        console.log('totalTokens: ', totalTokens + response.data.completion.data.usage.total_tokens)
      }
      
      // Hide the ellipsis
      ellipsis !== null ? ellipsis.style.display = 'none' : null
  
      // Show the input
      setSuggestion('')
      inputWrap !== null ? inputWrap.style.display = 'grid' : null
      input !== null ? input.focus() : null
  
      // Scroll to bottom (need the timeout for the element to be rendered... best way to do this?)
      setTimeout(() => {
        const agentMsgs = document.getElementsByClassName('userMsg')
        const lastAgentMsg = agentMsgs[agentMsgs.length - 1] as HTMLElement
        scrollToBottom(lastAgentMsg)
      }, 100)
    })
  }
  
  return (
    <div id="inputWrap">
      <textarea id="userInput" name="userInput" rows={1} onInput={onInput} ref={userInput} onKeyDown={handleInputKeyDown} autoFocus placeholder={suggestion} data-lpignore="true" />
    </div>
  )
}

export default UserInput
