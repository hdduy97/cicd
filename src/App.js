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
import './app.scss'

import { SET_CUSTOMER, RESET_TOKEN, RESET_CUSTOMER, SET_TOKEN, HIDE_LOADING } from './reducers/types'

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

  useEffect(() => {
    if (customer.id) setIsAuthed(true)
  }, [customer.id])

  useEffect(() => {
    const token = Cookie.get('token')

    const getDataInfo = async () => {
      if (token && token.length > 0) {
        dispatch({ type: SET_TOKEN, payload: token})
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
      } else {
        setIsAuthed(false)
      }

      try {
        const [{ data: navResponse }, { data: logo }] = await axios.all([
          axios.get(process.env.REACT_APP_RESTURL + '/categories'),
          axios.get(process.env.REACT_APP_RESTURL + '/store/logo')
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
