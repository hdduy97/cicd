import React from 'react'
import { useSelector } from 'react-redux'
import './globalMessage.scss'

const GlobalMessage = () => {
  const globalMessage = useSelector(state => state.globalMessage)

  const { text, isSuccess } = globalMessage

  return text.length === 0 ? null :
  (
    <div className={`global-message ${isSuccess ? 'success' : 'error'}`}>{text}</div>
  )
}

export default GlobalMessage
