import React, { useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import axios from 'axios'

import Layout from '../layout'

import './index.scss'

import { CHANGE_GLOBAL_MESSAGE, SET_CUSTOMER } from '../../../../../reducers/types'

const Index = () => {
  const customer = useSelector(state => state.customer)
  const token = useSelector(state => state.token)

  const [firstname, setFirstname] = useState(customer.firstname)
  const [lastname, setLastname] = useState(customer.lastname)
  const [email, setEmail] = useState(customer.email)
  const [password, setPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmNewPassword, setConfirmNewPassword] = useState('')
  const [changeEmail, setChangeEmail] = useState(false)
  const [changePassword, setChangePassword] = useState(false)

  const dispatch = useDispatch()
  
  const showMessage = (isSuccess, message) => {
    dispatch({ type: CHANGE_GLOBAL_MESSAGE, payload: { isSuccess, message }})
  
    setTimeout(() => {
      dispatch({ type: CHANGE_GLOBAL_MESSAGE, payload: {
        isSuccess: false,
        message: ''
      }})
    }, 5000)
  }
  
  const showErrorMessage = (message) => showMessage(false, message)
  const showSuccessMessage = (message) => showMessage(true, message)

  const changeAccountInformation = async (data) => {
    return axios.put(process.env.REACT_APP_RESTURL + '/customers/me',
      {
        customer: data
      },
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    )
  }

  const onSubmit = async (e) => {
    e.preventDefault()
    try {
      let customerData = {
        ...customer,
        firstname,
        lastname
      }
      let validPassword = true

      if (changeEmail && !changePassword) {
        try {
          await axios.post(process.env.REACT_APP_RESTURL + '/integration/customer/token', {
            username: customer.email,
            password
          })
        } catch (e) {
          validPassword = false
          showErrorMessage("The password doesn't match this account. Verify the password and try again.")
        }
      }
      if (validPassword) {
        if (changeEmail) {
          customerData.email = email
        }
        if (changePassword) {
          if (newPassword === confirmNewPassword) {
            try {
              const changePasswordAxios = axios.put(process.env.REACT_APP_RESTURL + '/customers/me/password', 
                {
                  currentPassword: password,
                  newPassword
                },
                {
                  headers: {
                    Authorization: `Bearer ${token}`
                  }
                }
              )
              
              const [{ data: customerResponse }] = await axios.all([changeAccountInformation(customerData), changePasswordAxios])
  
              dispatch({ type: SET_CUSTOMER, payload: customerResponse })
              showSuccessMessage('You saved the account information.')
            } catch (e) {
              showErrorMessage(e.response.data.message)
            }
          }
        } else {
          const { data: customerResponse } = await changeAccountInformation(customerData)

          dispatch({ type: SET_CUSTOMER, payload: customerResponse })
          showSuccessMessage('You saved the account information.')
        }
      } 
    } catch (e) {
      showErrorMessage(e.response.data.message)
    }
  }

  const changeEmailAndPasswordStyle = changeEmail || changePassword
    ? {}
    : { display: 'none' }

  const changeEmailAndPasswordTitle = changeEmail && changePassword
    ? 'Change Email and Password'
    : changeEmail
    ? 'Change Email'
    : changePassword
    ? 'Change Password'
    : ''

  const hideChangePasswordStyle = changePassword ? {} : { display: 'none' }
  const hideChangeEmailStyle = changeEmail ? {} : { display: 'none' }

  return (
    <Layout>
      <div className="page-title-wrapper">
        <h1 className="page-title"><span>Edit Account Information</span></h1>
      </div>
      <form onSubmit={onSubmit} className="form form-edit-account">
        <div className="fieldsets">
          <fieldset className="fieldset info">
            <legend className="legend"><span>Account Information</span></legend>
              <div className="field field-name-firstname required">
                <label className="label"><span>First Name</span></label>
                <div className="control">
                    <input 
                      type="text"
                      className="input-text required-entry"
                      value={firstname} 
                      onChange={e => setFirstname(e.target.value)}  
                    />
                </div>
              </div>
              <div className="field field-name-lastname required">
                <label className="label"><span>Last Name</span></label>
                <div className="control">
                  <input 
                    type="text"
                    className="input-text required-entry"
                    value={lastname}
                    onChange={e => setLastname(e.target.value)}
                  />
                </div>
              </div>
              <div className="field choice">
                <label>
                  <input 
                    type="checkbox"
                    className="checkbox"
                    checked={changeEmail}
                    onChange={e => setChangeEmail(e.target.checked)}
                  />
                  <span className="label">Change Email</span>
                </label>
              </div>
              <div className="field choice">
                <label>
                  <input
                    type="checkbox"
                    className="checkbox"
                    checked={changePassword}
                    onChange={e => setChangePassword(e.target.checked)}
                  />
                  <span className="label">Change Password</span>
                </label>
              </div>
          </fieldset>
          <fieldset className="fieldset password" style={changeEmailAndPasswordStyle}>
            <legend className="legend">
              <span>{changeEmailAndPasswordTitle}</span>
            </legend>
            <div className="field email required" style={hideChangeEmailStyle}>
              <label className="label"><span>Email</span></label>
              <div className="control">
                <input
                  type="text"
                  className="input-text"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                />
              </div>
            </div>
            <div className="field password current required">
              <label className="label"><span>Current Password</span></label>
              <div className="control">
                <input
                  type="password"
                  className="input-text"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                />
              </div>
            </div>
            <div className="field new password required" style={hideChangePasswordStyle}>
              <label className="label"><span>New Password</span></label>
              <div className="control">
                <input
                  type="password"
                  className="input-text"
                  value={newPassword}
                  onChange={e => setNewPassword(e.target.value)}
                />
                <div>
                  <div className="password-strength-meter">
                    Password Strength:
                    <span>No Password</span>
                  </div>
                </div>
              </div>
            </div>
            <div className="field confirmation password required" style={hideChangePasswordStyle}>
              <label className="label"><span>Confirm New Password</span></label>
              <div className="control">
                <input
                  type="password"
                  className="input-text"
                  value={confirmNewPassword}
                  onChange={e => setConfirmNewPassword(e.target.value)}
                />
              </div>
            </div>
          </fieldset>
        </div>
        <div className="field password-info">
          <p>
            If you created this account using Amazon Pay, you might not know your site password.<br />
            In order to reset your password, please <a href="https://demo.lotustest.net/customer/account/logout/">Sign Out</a> and click on “Forgot Your Password?” from the Sign In page
          </p>
        </div>
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
