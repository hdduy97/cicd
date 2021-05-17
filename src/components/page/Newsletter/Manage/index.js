import React, { useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { useHistory } from 'react-router-dom'
import axios from 'axios'

import Layout from '../../Customer/Account/layout'

import { ADD_GLOBAL_MESSAGE, SET_CUSTOMER, SHOW_LOADING, HIDE_LOADING } from '../../../../reducers/types'

const Index = () => {
  const customer = useSelector(state => state.customer)
  const token = useSelector(state => state.token)

  const [isSubscribed, setIsSubscribed] = useState(customer.extension_attributes.is_subscribed)

  const history = useHistory()

  const dispatch = useDispatch()
  
  const showMessage = (isSuccess, message) => {
    dispatch({ type: ADD_GLOBAL_MESSAGE, payload: { isSuccess, message }})
  }
  
  const showErrorMessage = (message) => showMessage(false, message)
  const showSuccessMessage = (message) => showMessage(true, message)

  const onSubmit = async (e) => {
    e.preventDefault()
    dispatch({ type: SHOW_LOADING })

    try {
      const { data: customerResponse } = await axios.put(process.env.REACT_APP_RESTURL + '/customers/me', 
        {
          customer: {
            ...customer,
            extension_attributes: {
              ...customer.extension_attributes,
              is_subscribed: isSubscribed
            }
          }
        },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      )

      dispatch({ type: SET_CUSTOMER, payload: customerResponse })
      history.push('/customer/account')
      showSuccessMessage('We have saved your subscription.')
    } catch (e) {
      showErrorMessage(e.response.data.message)
    }

    dispatch({ type: HIDE_LOADING })
  }

  return (
    <Layout>
      <div className="page-title-wrapper">
        <h1 className="page-title"><span>Newsletter Subscription</span></h1>
      </div>
      <form onSubmit={onSubmit} className="form form-newsletter-manage">
        <fieldset className="fieldset">
          <legend className="legend"><span>Subscription option</span></legend>
          <div className="field choice">
            <label className="label">
              <input 
                type="checkbox"
                className="checkbox"
                checked={isSubscribed}
                onChange={e => setIsSubscribed(e.target.checked)}
              />
              <span>General Subscription</span>
            </label>
          </div>
        </fieldset>
        <div className="actions-toolbar">
            <div className="primary">
              <button type="submit" className="action save primary"><span>Save</span></button>
            </div>
        </div>
      </form>
    </Layout>
  )
}

export default Index
