import React from 'react'
import { useSelector } from 'react-redux'
import './globalMessage.scss'

const GlobalMessage = () => {
  const globalMessage = useSelector(state => state.globalMessage)

  const { message, isSuccess } = globalMessage

  return (
    <div className="page messages">
      { message.length > 0 && <div className={`global-message ${isSuccess ? 'success' : 'error'}`}>{message}</div> }
    </div>
  )
}

export default GlobalMessage
