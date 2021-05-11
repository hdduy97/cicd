import React, { useEffect, useState } from 'react'
import {
  BrowserRouter as Router,
  Switch,
  Route
} from "react-router-dom"

import { useDispatch, useSelector } from 'react-redux'

import Cookie from 'js-cookie'
import axios from 'axios'

import Header from './components/Header/header'
import GlobalMessage from './components/globalMessage'
import Home from './components/page/Home'
import CustomerAccount from './components/page/Customer/Account'
import SalesOrderHistory from './components/page/Sales/Order/History'
import Category from './components/page/Category'
import Product from './components/page/Product'
import AuthRoute from './components/authRoute'
import CustomerAccountEdit from './components/page/Customer/Account/Edit'
import './app.scss'

import { SET_CUSTOMER, RESET_TOKEN, RESET_CUSTOMER, SET_TOKEN } from './reducers/types'

const App = () => {
  const [isAuthed, setIsAuthed] = useState(true)
  const [loading, setLoading] = useState(true)
  
  const dispatch = useDispatch()

  const customer = useSelector(state => state.customer)

  useEffect(() => {
    if (customer.id) setIsAuthed(true)
  }, [customer.id])

  useEffect(() => {
    const getCustomerInfo = async (token) => {
      try {
        const { data: customer } = await axios.get(process.env.REACT_APP_RESTURL + '/customers/me', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        })

        dispatch({ type: SET_CUSTOMER, payload: customer })
      } catch(e) {
        setIsAuthed(false)
        dispatch({ type: RESET_TOKEN })
        dispatch({ type: RESET_CUSTOMER })
      }

      setLoading(false)
    }
    const token = Cookie.get('token')
    
    if (token && token.length > 0) {
      dispatch({ type: SET_TOKEN, payload: token})
      getCustomerInfo(token)
    } else {
      setLoading(false)
      setIsAuthed(false)
    }
  }, [dispatch])

  if (loading) return null

  return (
    <Router>
      <Header />
      <GlobalMessage />
      
      <div className="container">
        <Switch>
          <AuthRoute path="/customer/account/edit" component={CustomerAccountEdit} authed={isAuthed} customer={customer} />
          <AuthRoute path="/customer/account" component={CustomerAccount} authed={isAuthed} />
          <Route path="/sales/order/history">
            <SalesOrderHistory />
          </Route>
          <Route path="/category/:id">
            <Category />
          </Route>
          <Route path="/product/:sku">
            <Product />
          </Route>
          <Route path="/">
            <Home />
          </Route>
        </Switch>
      </div>
    </Router>
  )
}

export default App;
