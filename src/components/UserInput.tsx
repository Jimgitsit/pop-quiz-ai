import React, {FC, useState} from 'react'
import {useRef} from 'react'
import {Msg} from '../App'
import OpenAIEx from '../OpenAIEx'

interface Props {
  msgHistory: Msg[],
  setMsgHistory: React.Dispatch<React.SetStateAction<Msg[]>>,
  openAIEx: OpenAIEx
}

const suggestions = [
  'The history of submarines',
  'Albert Einstein',
  'Thomas Edison',
  'The history of the internet',
  "Algebra Fundamentals",
  "Introduction to Philosophy",
  "Basic HTML and CSS",
  "World War I History",
  "Introductory Astronomy",
  "Principles of Economics",
  "Elementary Physics",
  "Organic Chemistry Basics",
  "Classical Literature",
  "Human Anatomy Essentials",
  "Introduction to Psychology",
  "Environmental Science 101",
  "French Language",
  "Statistical Methods",
  "Early American History",
  "Foundations of Music Theory",
  "Introduction to Robotics",
  "Basic Photography Techniques",
  "Elementary Geology",
  "Introductory Sociology"
]

const UserInput: FC<Props> = (props: Props) => {
  const userInput = useRef<HTMLTextAreaElement>(null)
  
  const newSuggestion = () => {
    return suggestions[Math.floor(Math.random() * suggestions.length)] + ' (space to accept)'
  }
  
  const [suggestion, setSuggestion] = useState(newSuggestion())
  
  const handleInputKeyDown = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
    const input = document.getElementById('userInput') as HTMLTextAreaElement
    console.log('input.value.length: ', input.value.length)
    if (event.key === 'Enter') {
      submitInput()
    }
    else if (input.value.length === 0 && event.key === ' ') {
      acceptSuggestion(event)
    }
  }
  
  const onInput = (event: React.FormEvent<HTMLTextAreaElement>) => {
    const el = event.target as HTMLTextAreaElement
    el.dataset.replicatedValue = el.value
  }
  
  const acceptSuggestion = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
    console.log('acceptSuggestion')
    event.preventDefault()
    
    const prompt = suggestion.replace(' (space to accept)', '')
    userInput.current !== null ? userInput.current.value = prompt : null
  }
  
  const scrollToBottom = (bottomElement: HTMLElement) => {
    setTimeout(() => {
      // window.scrollTo(0, document.body.scrollHeight)
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
    scrollToBottom(ellipsis)
    
    // Get completion from openai and add to msgHistory
    props.openAIEx.getCompletion(newPrompt).then((completion) => {
      // Update the message history with the agent's response
      msgHistory = [...msgHistory, {type: 'agent', msg: completion}]
      props.setMsgHistory(msgHistory)
      
      // Hide the ellipsis
      ellipsis !== null ? ellipsis.style.display = 'none' : null
      
      // Show the input
      setSuggestion('')
      inputWrap !== null ? inputWrap.style.display = 'grid' : null
      input !== null ? input.focus() : null
      
      // Scroll to bottom (need the timeout for the element to be rendered... best way to do this?)
      setTimeout(() => {
        const agentMsgs = document.getElementsByClassName('agentMsg')
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
