import React, { useState } from 'react'
import axios from 'axios'
import { useDispatch } from 'react-redux'

import { CHANGE_GLOBAL_MESSAGE, SET_TOKEN, SET_CUSTOMER, SHOW_LOADING, HIDE_LOADING } from '../../reducers/types'

const CreateForm = ({ setShowCreateForm }) => {
  const [firstname, setFirstname] = useState('')
  const [lastname, setLastname] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const dispatch = useDispatch()
  
  const showMessage = (isSuccess, message) => {
    dispatch({ type: CHANGE_GLOBAL_MESSAGE, payload: { isSuccess, message }})
  
    setTimeout(() => {
      dispatch({ type: CHANGE_GLOBAL_MESSAGE, payload: {
        isSuccess: false,
        message: ''
      }})
    }, 5000)
  }
  
  const showErrorMessage = (message) => showMessage(false, message)
  const showSuccessMessage = (message) => showMessage(true, message)

  const login = async () => {
    try {
      const { data: token } = await axios.post(process.env.REACT_APP_RESTURL + '/integration/customer/token', {
        username: email,
        password
      })

      const { data: customer } = await axios.get(process.env.REACT_APP_RESTURL + '/customers/me', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })

      dispatch({ type: SET_TOKEN, payload: token })
      dispatch({ type: SET_CUSTOMER, payload: customer })
      
      setShowCreateForm(false)
    } catch(e) {
      showErrorMessage(e.response.data.message)
    }
    dispatch({ type: HIDE_LOADING })
  }

  const onSubmit = async (e) => {
    e.preventDefault()
    dispatch({ type: SHOW_LOADING })

    try {
      await axios.post(process.env.REACT_APP_RESTURL + '/customers', { 
        customer: {
          email,
          firstname,
          lastname
        }, 
        password
      })

      showSuccessMessage('Successfully sign up')

      login()
    } catch (e) {
      if (e.response.data.id) login()
      else {
        dispatch({ type: HIDE_LOADING })
        showErrorMessage(e.response.data.message)
      }
    }
  }

  return (
    <form onSubmit={onSubmit}>
      <div className="field">
        <label>First name: </label>
        <input type="text" value={firstname} onChange={e => setFirstname(e.target.value)}/>
      </div>
      <div className="field">
        <label>Last name: </label>
        <input type="text" value={lastname} onChange={e => setLastname(e.target.value)}/>
      </div>
      <div className="field">
        <label>Email: </label>
        <input type="email" value={email} onChange={e => setEmail(e.target.value)}/>
      </div>
      <div className="field">
        <label>Password: </label>
        <input type="password" value={password} onChange={e => setPassword(e.target.value)} />
      </div>
      <div className="field-submit">
        <button>Create</button>
      </div>
    </form>
  )
}

export default CreateForm
