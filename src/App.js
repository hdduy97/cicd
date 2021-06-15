import React, { useEffect, useState } from 'react'
import {
  BrowserRouter as Router,
  Switch,
  Route
} from "react-router-dom"

import { useDispatch, useSelector } from 'react-redux'

import Cookie from 'js-cookie'
import axios from 'axios'

import Loading from './components/loading'
import Header from './components/Header'
import Footer from './components/Footer'
import Navigation from './components/navigation'
import GlobalMessage from './components/globalMessage'
import Home from './components/page/Home'
import CustomerAccount from './components/page/Customer/Account'
import SalesOrderHistory from './components/page/Sales/Order/History'
import Category from './components/page/Category'
import Product from './components/page/Product'
import AuthRoute from './components/authRoute'
import CustomerAccountEdit from './components/page/Customer/Account/Edit'
import NewsletterManage from './components/page/Newsletter/Manage'
import Checkout from './components/page/Checkout'
import './app.scss'

import { SET_CUSTOMER, RESET_TOKEN, RESET_CUSTOMER, SET_TOKEN, HIDE_LOADING, SET_QUOTE_ID, SET_GUEST_CART_ID } from './reducers/types'

const App = () => {
  const [isAuthed, setIsAuthed] = useState(true)
  const loading = useSelector(state => state.loading)
  const [loadingState, setLoadingState] = useState(loading)
  const [categories, setCategories] = useState([])
  const [logo, setLogo] = useState({
    src: '',
    width: 0,
    height: 0,
    alt: null
  })
  
  const dispatch = useDispatch()

  const customer = useSelector(state => state.customer)

  axios.defaults.baseURL = process.env.REACT_APP_RESTURL
  axios.defaults.headers.common['Content-Type'] = 'application/json'

  useEffect(() => {
    if (customer.id) setIsAuthed(true)
  }, [customer.id])

  useEffect(() => {
    const token = Cookie.get('token')
    const guestCartId = Cookie.get('guest-cart-id')

    const getDataInfo = async () => {
      if (token && token.length > 0) {
        dispatch({ type: SET_TOKEN, payload: token})
        const headers = { Authorization: `Bearer ${token}` }
        try {
          const getCustomer = axios.get('/customers/me', { headers })
          const getQuoteId = axios.post('/carts/mine', {}, { headers } )
          const [{ data: customer }, { data: quoteId }] = await axios.all([getCustomer, getQuoteId])
          
          dispatch({ type: SET_QUOTE_ID, payload: quoteId})
          dispatch({ type: SET_CUSTOMER, payload: customer })
        } catch(e) {
          setIsAuthed(false)
          dispatch({ type: RESET_TOKEN })
          dispatch({ type: RESET_CUSTOMER })
        }
      } else {
        setIsAuthed(false)
      }

      if (guestCartId) {
        dispatch({ type: SET_GUEST_CART_ID, payload: guestCartId })
      }

      try {
        const [{ data: navResponse }, { data: logo }] = await axios.all([
          axios.get('/categories'),
          axios.get('/store/logo')
        ])

        setCategories(navResponse.children_data)
        setLogo(logo)
      } catch(e) {}

      dispatch({ type: HIDE_LOADING })
      setLoadingState(false)
    }

    getDataInfo()
  }, [dispatch])

  if (loadingState) return <Loading />

  return (
    <Router>
      <Header logo={logo} />
      <Navigation categories={categories} />
      <GlobalMessage />
      { loading ? <Loading /> : null }
      
      <div className="container">
        <Switch>
          <AuthRoute path="/newsletter/manage" component={NewsletterManage} authed={isAuthed} />
          <AuthRoute path="/customer/account/edit" component={CustomerAccountEdit} authed={isAuthed} />
          <AuthRoute path="/customer/account" component={CustomerAccount} authed={isAuthed} />
          <AuthRoute path="/sales/order/history" component={SalesOrderHistory} authed={isAuthed} />
          <Route path="/checkout" component={Checkout} />
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
      <Footer />
    </Router>
  )
}

export default App;
