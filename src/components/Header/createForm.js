import React, { useState } from 'react'
import axios from 'axios'
import { useDispatch } from 'react-redux'

import { ADD_GLOBAL_MESSAGE, SET_TOKEN, SET_CUSTOMER, SHOW_LOADING, HIDE_LOADING, SET_QUOTE_ID } from '../../reducers/types'

const CreateForm = ({ setShowCreateForm }) => {
  const [firstname, setFirstname] = useState('')
  const [lastname, setLastname] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const dispatch = useDispatch()
  
  const showMessage = (isSuccess, message) => {
    dispatch({ type: ADD_GLOBAL_MESSAGE, payload: { isSuccess, message }})
  }
  
  const showErrorMessage = (message) => showMessage(false, message)
  const showSuccessMessage = (message) => showMessage(true, message)

  const login = async () => {
    try {
      const { data: token } = await axios.post('/integration/customer/token', {
        username: email,
        password
      })

      const headers = { Authorization: `Bearer ${token}` }

      const getCustomer = axios.get('/customers/me', { headers })
      const getQuoteId = axios.post('/carts/mine', {}, { headers } )
      const [{ data: customer }, { data: quoteId }] = await axios.all([getCustomer, getQuoteId])

      dispatch({ type: SET_QUOTE_ID, payload: quoteId})
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
      await axios.post('/customers', { 
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
