import React, { useEffect, useRef } from 'react'

const PopupBlock = ({ children, setShowComponent }) => {
  const popupRef = useRef()

  useEffect(() => {
    const handleClick = (event) => {
      const { target } = event
      if (popupRef.current && !popupRef.current.contains(target)) {
        setShowComponent(false)
      }
    }

    document.addEventListener('click', handleClick)

    return () => {
      document.removeEventListener('click', handleClick)
    }
  }, [setShowComponent])

  return (
    <div ref={popupRef}>
      {children}
    </div>
  )
}

export default PopupBlock
