import React from 'react'

import Layout from '../layout'

import './index.scss'

const Index = () => {
  return (
    <Layout>
      <div className="page-title-wrapper">
        <h1 className="page-title"><span>Edit Account Information</span></h1>
      </div>
      <form className="form form-edit-account">
        <div className="fieldsets">
          <fieldset className="fieldset info">
            <legend className="legend"><span>Account Information</span></legend>
              <div className="field field-name-firstname required">
                <label className="label"><span>First Name</span></label>
                <div className="control">
                    <input type="text" id="firstname" className="input-text required-entry" />
                </div>
              </div>
              <div className="field field-name-lastname required">
                <label className="label"><span>Last Name</span></label>
                <div className="control">
                  <input type="text" className="input-text required-entry" />
                </div>
              </div>
              <div className="field choice">
                <label>
                  <input type="checkbox" className="checkbox" />
                  <span className="label">Change Email</span>
                </label>
              </div>
              <div className="field choice">
                <label>
                  <input type="checkbox" className="checkbox" />
                  <span className="label">Change Password</span>
                </label>
              </div>
          </fieldset>
          <fieldset class="fieldset password">
            <legend class="legend">
              <span>Change Password</span>
            </legend>
            <div class="field email required">
              <label class="label"><span>Email</span></label>
              <div class="control">
                <input type="text" class="input-text" />
              </div>
            </div>
            <div class="field password current required">
              <label class="label"><span>Current Password</span></label>
              <div class="control">
                <input type="password" class="input-text" />
              </div>
            </div>
            <div class="field new password required">
              <label class="label"><span>New Password</span></label>
              <div class="control">
                <input type="password" class="input-text" />
                <div>
                  <div class="password-strength-meter">
                    Password Strength:
                    <span>No Password</span>
                  </div>
                </div>
              </div>
            </div>
            <div class="field confirmation password required">
              <label class="label"><span>Confirm New Password</span></label>
              <div class="control">
                <input type="password" class="input-text" />
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
