import React, { useState } from 'react'

import LoginForm from './loginForm'
import CreateForm from './createForm'
import PopupBlock from '../popupBlock'
import './panel.scss'

const Panel = () => {
  const [showLoginForm, setShowLoginForm] = useState(false)
  const [showCreateFrom, setShowCreateForm] = useState(false)
  const accountDropdown = false && 
  (
    <ul className="header dropdown">
      <li>Account</li>
      <li>My Wish List</li>
      <li>Sign Out</li>
    </ul>
  )

  const loginFormRender = showLoginForm && 
  (
    <PopupBlock setShowComponent={setShowLoginForm}>
      <LoginForm setShowLoginForm={setShowLoginForm} />
    </PopupBlock>
  )

  const createFormRender = showCreateFrom && 
  (
    <PopupBlock setShowComponent={setShowCreateForm}>
      <CreateForm setShowCreateForm={setShowCreateForm} />
    </PopupBlock>
  )

  return (
    <div className="panel wrapper">
      <div className="panel header">
        <ul className="header links">
          <li className="account-action">
            <span onClick={() => setShowLoginForm(true)}>Log In</span>
            {loginFormRender}
          </li>
          <li>or</li>
          <li className="account-action">
            <span onClick={() => setShowCreateForm(true)}>Create an Account</span>
            {createFormRender}
          </li>
        </ul>
        <div className="header action">
        </div>
        {accountDropdown}
      </div>
    </div>
  )
}

export default Panel
