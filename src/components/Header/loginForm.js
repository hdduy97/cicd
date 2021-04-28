import React, { useState } from 'react'
import axios from 'axios'

const LoginForm = () => {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')

  const onSubmit = async (e) => {
    e.preventDefault()

    try {
      const { data } = await axios.post(process.env.REACT_APP_RESTURL + '/integration/customer/token', { username, password })

      console.log(data)
    } catch (e) {
      alert(e.response.data.message)
    }
  }

  return (
    <form onSubmit={onSubmit}>
      <div className="field">
        <label>Email: </label>
        <input type="email" value={username} onChange={e => setUsername(e.target.value)}/>
      </div>
      <div className="field">
        <label>Password: </label>
        <input type="password" value={password} onChange={e => setPassword(e.target.value)} />
      </div>
      <button>Login</button>
    </form>
  )
}

export default LoginForm
