import React from 'react'
import { Link } from 'react-router-dom'
import { useSelector } from 'react-redux'

import Layout from './layout'

import './index.scss'

const Index = () => {
  const customer = useSelector(state => state.customer)
  
  return (
    <Layout>
      <div className="page-title-wrapper">
        <h1 className="page-title"><span>My Account</span></h1>
      </div>
      <div className="block-dashboard-info">
        <div className="block-title">
          <span>Account Information</span>
        </div>
        <div className="block-content">
          <div className="box-information">
            <strong className="box-title">
              <span>Contact Information</span>
            </strong>
            <div className="box-content">
              <p>
                {`${customer.firstname} ${customer.lastname}`}
                <br />
                {customer.email}
              </p>
            </div>
            <div className="box-actions">
              <Link to="/customer/account/edit" className="action edit">
                <span>Edit</span>
              </Link>
              <div className="line-break"></div>
              <Link to="/" className="action change-password">
                <span>Change Password</span>
              </Link>
            </div>
          </div>
          <div className="box-newsletter">
            <strong className="box-title">
              <span>Newsletters</span>
            </strong>
            <div className="box-content">
              <p>You are subscribed to "General Subscription".</p>
            </div>
            <div className="box-actions">
              <Link to="/" className="action edit">
                <span>Edit</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  )
}

export default Index
