import React from 'react'
import { useSelector } from 'react-redux'
import './globalMessage.scss'

const GlobalMessage = () => {
  const globalMessage = useSelector(state => state.globalMessage)

  const { text, isSuccess } = globalMessage

  return (
    <div className="page messages">
      { text.length > 0 && <div className={`global-message ${isSuccess ? 'success' : 'error'}`}>{text}</div> }
    </div>
  )
}

export default GlobalMessage
