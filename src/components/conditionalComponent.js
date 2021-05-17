import React from 'react'

const ConditionalComponent = ({ children, condition, loading }) => {
  if (!condition || loading) return null

  return (
    <>
      {children} 
    </>
  )
}

export default ConditionalComponent
