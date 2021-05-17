import React from 'react'
import { useSelector } from 'react-redux'
import './globalMessage.scss'

const GlobalMessage = () => {
  const globalMessage = useSelector(state => state.globalMessage)

  const globalMessageRender = globalMessage.map(({ isSuccess, message }, index) => {
    return <div key={index} className={`global-message ${isSuccess ? 'success' : 'error'}`}>{message}</div>
  })

  return (
    <div className="page messages">
      { globalMessageRender }
    </div>
  )
}

export default GlobalMessage
