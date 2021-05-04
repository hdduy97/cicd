import React, { useState } from 'react'
import { useSelector } from 'react-redux'

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
  
  const customer = useSelector(state => state.customer)

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

  const headerLinksCustomer = (
    <span>Welcome, {customer.firstname} {customer.lastname}!</span>
  )

  const headerLinksGuest = (
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
  )

  const headerLinks = customer.id ? headerLinksCustomer : headerLinksGuest

  return (
    <div className="panel wrapper">
      <div className="panel header">
        {headerLinks}
        <div className="header action">
        </div>
        {accountDropdown}
      </div>
    </div>
  )
}

export default Panel
