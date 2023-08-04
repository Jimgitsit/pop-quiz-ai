import React, {FC} from 'react'
import {useRef} from 'react'
import {Msg} from '../App'
import {getCompletion} from '../openaiex.tsx'

interface Props {
  msgHistory: Msg[],
  setMsgHistory: React.Dispatch<React.SetStateAction<Msg[]>>
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
  "Beginning French Language",
  "Statistical Methods",
  "Early American History",
  "Foundations of Music Theory",
  "Introduction to Robotics",
  "Basic Photography Techniques",
  "Elementary Geology",
  "Introductory Sociology"
]

const UserInput: FC<Props> = (props: Props) => {
  
  const userInput = useRef<HTMLInputElement>(null)
  
  let suggestion = ''
  if (props.msgHistory.length === 0) {
    suggestion = suggestions[Math.floor(Math.random() * suggestions.length)] + ' (tab to accept)'
  }
  
  const handleInputKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      submitInput()
    }
    else if (event.key === 'Tab') {
      acceptSuggestion(event)
    }
    
    // Clear the placeholder
    const input = document.getElementById('userInput') as HTMLInputElement
    input !== null ? input.setAttribute('placeholder', '') : null
  }
  
  const acceptSuggestion = (event: React.KeyboardEvent<HTMLInputElement>) => {
    event.preventDefault()
    
    suggestion = suggestion.replace(' (tab to accept)', '')
    userInput.current !== null ? userInput.current.value = suggestion : null
  }
  
  const submitInput = () => {
    const input = document.getElementsByName('userInput')[0] as HTMLInputElement
    const newMsg = input.value
    let msgHistory = [...props.msgHistory, {type: 'user', msg: newMsg}]
    props.setMsgHistory(msgHistory)
    userInput.current !== null ? userInput.current.value = '' : null
    
    const inputWrap = document.getElementById('inputWrap') as HTMLElement
    inputWrap !== null ? inputWrap.style.display = 'none' : null
    
    const ellipsis = document.getElementById('ldsEllipsis') as HTMLElement
    ellipsis !== null ? ellipsis.style.display = 'block' : null
    window.scrollTo(0, window.innerHeight + 100)
    
    // TODO: Get completion from openai and add to msgHistory
    getCompletion(newMsg).then((completion) => {
      ellipsis !== null ? ellipsis.style.display = 'none' : null
      
      msgHistory = [...msgHistory, {type: 'agent', msg: completion}]
      props.setMsgHistory(msgHistory)
      
      // Scroll to bottom of window
      setTimeout(() => {
        inputWrap !== null ? inputWrap.style.display = 'block' : null
        input !== null ? input.focus() : null
        window.scrollTo(0, window.innerHeight + 100)
      }, 200)
    })
  }
  
  return (
    <div id="inputWrap">
      <input id="userInput" name="userInput" ref={userInput} onKeyDown={handleInputKeyDown} autoFocus placeholder={suggestion} />
    </div>
  )
}

export default UserInput
