import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { useDispatch } from 'react-redux'

const initialMessage = {
  isSuccess: true,
  text: ''
}

const CreateForm = ({ setShowCreateForm }) => {
  const [firstname, setFirstname] = useState('')
  const [lastname, setLastname] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const [message, setMessage] = useState(initialMessage)
  const dispatch = useDispatch()

  useEffect(() => {
    if (message.text.length > 0) {
      dispatch({ type: 'CHANGE_GLOBAL_MESSAGE', payload: message})
      setTimeout(() => {
        dispatch({ type: 'CHANGE_GLOBAL_MESSAGE', payload: initialMessage})
      }, 5000);
    }
  }, [message, dispatch])

  const login = async () => {
    try {
      const { data } = await axios.post(process.env.REACT_APP_RESTURL + '/integration/customer/token', {
        username: email,
        password
      })

      dispatch({ type: 'SET_TOKEN', payload: data })
      
      setShowCreateForm(false)
    } catch(e) {
      setMessage({
        isSuccess: false,
        text: e.response.data.message
      })
    }
  }

  const onSubmit = async (e) => {
    e.preventDefault()

    try {
      await axios.post(process.env.REACT_APP_RESTURL + '/customers', { 
        customer: {
          email,
          firstname,
          lastname
        }, 
        password
      })

      setMessage({
        isSuccess: true,
        text: 'Successfully sign up'
      })

      login()
    } catch (e) {
      if (e.response.data.id) login()
      else {
        setMessage({
          isSuccess: false,
          text: e.response.data.message
        })
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
