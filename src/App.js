import React, { useState } from 'react'
import './App.css'

const App = () => {
  const [count, setCount] = useState(0)

  const onClick = async () => setCount(count + 1)

  return (
    <div>
      <div>Count: {count}</div>
      <div className="double-count">Double count: {count * 2 }</div>
      <button onClick={onClick}>Increase count</button>
    </div>
  )
}

export default App;
