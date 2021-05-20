import React, { useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { Link, useHistory } from 'react-router-dom'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faChevronDown, faChevronUp } from '@fortawesome/free-solid-svg-icons'
import LoginForm from './loginForm'
import CreateForm from './createForm'
import PopupBlock from '../popupBlock'
import './panel.scss'

import { RESET_TOKEN, RESET_CUSTOMER, RESET_CART } from '../../reducers/types'

const Panel = () => {
  const [showLoginForm, setShowLoginForm] = useState(false)
  const [showCreateFrom, setShowCreateForm] = useState(false)
  const [showCustomerDropdown, setShowCustomerDropdown] = useState(false)
  
  const customer = useSelector(state => state.customer)

  const dispatch = useDispatch()
  const history = useHistory()

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

  const signOut = () => {
    setShowCustomerDropdown(false)
    dispatch({ type: RESET_TOKEN })
    dispatch({ type: RESET_CUSTOMER })
    dispatch({ type: RESET_CART })
    history.push('/')
  }

  const headerCustomerDropdown = (
    <>
      <span className="pointer"><FontAwesomeIcon icon={faChevronUp} /></span>
      <PopupBlock setShowComponent={setShowCustomerDropdown}>
        <ul className="header dropdown" onClick={() => setShowCustomerDropdown(false)}>
          <li><Link to="/customer/account">Account</Link></li>
          <li onClick={signOut}>Sign Out</li>
        </ul>
      </PopupBlock>
    </>
  )

  const headerCustomer = (
    <div>
      <span>Welcome, {customer.firstname} {customer.lastname}! </span>
      {showCustomerDropdown 
        ? headerCustomerDropdown 
        : <span className="pointer"><FontAwesomeIcon onClick={() => setShowCustomerDropdown(!showCustomerDropdown)} icon={faChevronDown} /></span>
      }
    </div>
  )

  const headerGuest = (
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

  const header = customer.id ? headerCustomer : headerGuest

  return (
    <div className="panel wrapper">
      <div className="panel header">
        {header}
      </div>
    </div>
  )
}

export default Panel
