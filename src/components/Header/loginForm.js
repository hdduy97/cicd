import React, { useState } from 'react'
import axios from 'axios'
import { useDispatch } from 'react-redux'

const LoginForm = ({ setShowLoginForm }) => {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const dispatch = useDispatch()

  const onSubmit = async (e) => {
    e.preventDefault()
    
    let message = {
      isSuccess: true,
      text: ''
    }

    try {
      const { data: token } = await axios.post(process.env.REACT_APP_RESTURL + '/integration/customer/token', { username, password })

      const { data: customer } = await axios.get(process.env.REACT_APP_RESTURL + '/customers/me', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })

      message = {
        isSuccess: true,
        text: 'Successfully logged in'
      }

      dispatch({ type: 'SET_TOKEN', payload: token })
      dispatch({ type: 'SET_CUSTOMER', payload: customer })
      
      setShowLoginForm(false)
    } catch (e) {
      message = {
        isSuccess: false,
        text: e.response.data.message
      }
    }
    
    dispatch({ type: 'CHANGE_GLOBAL_MESSAGE', payload: message})
    setTimeout(() => {
      message.text = ''
      dispatch({ type: 'CHANGE_GLOBAL_MESSAGE', payload: message})
    }, 5000);
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
      <div className="field-submit">
        <button>Login</button>
      </div>
    </form>
  )
}

export default LoginForm
