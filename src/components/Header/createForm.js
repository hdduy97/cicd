import React, { useState } from 'react'
import axios from 'axios'

const CreateForm = ({ setShowCreateForm }) => {
  const [firstname, setFirstname] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const login = async () => {
    try {
      const { data } = await axios.post(process.env.REACT_APP_RESTURL + '/integration/customer/token', {
        username: email,
        password
      })

      console.log(data)
      
      setShowCreateForm(false)
    } catch(e) {
      alert(e.response.data.message)
    }
  }

  const onSubmit = async (e) => {
    e.preventDefault()

    try {
      await axios.post(process.env.REACT_APP_RESTURL + '/customers', { 
        customer: {
          email,
          firstname
        }, 
        password
      })

      login()
    } catch (e) {
      if (e.response.data.id) login()
      else {
        alert(e.response.data.message)
      }
    }
  }

  return (
    <form onSubmit={onSubmit}>
      <div className="field">
        <label>Firstname: </label>
        <input type="text" value={firstname} onChange={e => setFirstname(e.target.value)}/>
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
