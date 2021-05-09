import React from 'react'
import {
  BrowserRouter as Router,
  Switch,
  Route
} from "react-router-dom"

import Header from './components/Header/header'
import GlobalMessage from './components/globalMessage'
import Home from './components/page/Home'
import CustomerAccount from './components/page/Customer/Account'
import SalesOrderHistory from './components/page/Sales/Order/History'
import Category from './components/page/Category'
import Product from './components/page/Product'
import './app.scss'

const App = () => {
  return (
    <Router>
      <Header />
      <GlobalMessage />
      
      <div className="container">
        <Switch>
          <Route path="/customer/account">
            <CustomerAccount />
          </Route>
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
