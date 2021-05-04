import React, { useEffect } from 'react'
import { useDispatch } from 'react-redux'

import Cookie from 'js-cookie'
import axios from 'axios'

import Navigation from './navigation'
import Panel from './panel'

const Header = () => {
  const dispatch = useDispatch()

  useEffect(() => {
    const getCustomerInfo = async (token) => {
      const { data: customer } = await axios.get(process.env.REACT_APP_RESTURL + '/customers/me', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })

      dispatch({ type: 'SET_CUSTOMER', payload: customer })
    }
    const token = Cookie.get('token')
    if (token.length > 0) {
      dispatch({ type: 'SET_TOKEN', payload: token})
      getCustomerInfo(token)
    }
  }, [dispatch])
  return (
    <header className="page-header">
      <Panel />
      <Navigation />
    </header>
  )
}

export default Header