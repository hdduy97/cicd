import React, { useState } from 'react'
import axios from 'axios'
import { useDispatch } from 'react-redux'

import { ADD_GLOBAL_MESSAGE, SET_TOKEN, SET_CUSTOMER, SHOW_LOADING, HIDE_LOADING } from '../../reducers/types'

const LoginForm = ({ setShowLoginForm }) => {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')

  const dispatch = useDispatch()
  
  const showMessage = (isSuccess, message) => {
    dispatch({ type: ADD_GLOBAL_MESSAGE, payload: { isSuccess, message }})
  }
  
  const showErrorMessage = (message) => showMessage(false, message)
  const showSuccessMessage = (message) => showMessage(true, message)

  const onSubmit = async (e) => {
    e.preventDefault()
    dispatch({ type: SHOW_LOADING })

    try {
      const { data: token } = await axios.post(process.env.REACT_APP_RESTURL + '/integration/customer/token', { username, password })

      const { data: customer } = await axios.get(process.env.REACT_APP_RESTURL + '/customers/me', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })

      showSuccessMessage('Successfully logged in')

      dispatch({ type: SET_TOKEN, payload: token })
      dispatch({ type: SET_CUSTOMER, payload: customer })
      
      setShowLoginForm(false)
    } catch (e) {
      showErrorMessage(e.response.data.message)
    }
    dispatch({ type: HIDE_LOADING })
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
