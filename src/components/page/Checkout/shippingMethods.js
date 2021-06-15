import React, { useState } from 'react'
import { useDispatch } from 'react-redux'
import axios from 'axios'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEdit } from '@fortawesome/free-solid-svg-icons'
import ConditionalComponent from '../../conditionalComponent'

import { ADD_GLOBAL_MESSAGE, SHOW_LOADING, HIDE_LOADING } from '../../../reducers/types'

const ShippingMethods = ({ step, setStep, methods, address, headers, setPaymentMethods, setTotals, setSelectedShippingMethod, cartsMineEndpoint }) => {
  const [selectedMethod, setSelectedMethod] = useState(methods[0])

  const dispatch = useDispatch()

  const shippingMethodsRender = methods.map(method => (
    <tr key={method.carrier_code + method.method_code} className="row" onClick={() => setSelectedMethod(method)}>
      <td>
        <input 
          type="radio"
          className="radio"
          value={method}
          checked={method.method_code === selectedMethod.method_code && method.carrier_code === selectedMethod.carrier_code}
          onChange={() => setSelectedMethod(method)}
        />
      </td>
      <td>${method.amount.toFixed(2)}</td>
      <td>{method.method_title}</td>
      <td>{method.carrier_title}</td>
    </tr>
  ))

  const onSubmit = async (e) => {
    e.preventDefault()

    dispatch({ type: SHOW_LOADING })

    try {
      const { data } = await axios.post(`${cartsMineEndpoint}/shipping-information`, {
        addressInformation: {
          shippingAddress: address,
          billingAddress: address,
          shippingMethodCode: selectedMethod.method_code,
          shippingCarrierCode: selectedMethod.carrier_code
        }
      }, { headers })

      setPaymentMethods(data.payment_methods)
      setTotals(data.totals)
      setSelectedShippingMethod(selectedMethod)
      setStep(3)
    } catch(e) {
      dispatch({ type: ADD_GLOBAL_MESSAGE, payload: { isSuccess: false, message: e.response.data.message }})
    }

    dispatch({ type: HIDE_LOADING })
  }

  return (
    <div className="checkout-step">
      <div className="step-title">
        <span>Shipping Methods</span>
        <ConditionalComponent condition={step > 2}>
          <span className="edit" onClick={() => setStep(2)}><FontAwesomeIcon icon={faEdit} /></span>
        </ConditionalComponent>
      </div>
      <ConditionalComponent condition={step === 2 && methods.length === 0}>
        <div className="empty-methods">
          Sorry, no shipping methods are available for this order at this time
        </div>
      </ConditionalComponent>
      <ConditionalComponent condition={step === 2 && methods.length > 0}>
        <form onSubmit={onSubmit}>
          <table className="table-checkout-shipping-method">
            <tbody>
              {shippingMethodsRender}
            </tbody>
          </table>
          <div className="form-actions">
            <button className="action primary">Next</button>
          </div>
        </form>
      </ConditionalComponent>
      <ConditionalComponent condition={step > 2}>
        <table className="table-checkout-shipping-method">
          <tbody>
            <tr className="row">
              <td>
                <input 
                  type="radio"
                  className="radio"
                  checked
                  readOnly
                />
              </td>
              <td>${selectedMethod.amount.toFixed(2)}</td>
              <td>{selectedMethod.method_title}</td>
              <td>{selectedMethod.carrier_title}</td>
            </tr>
          </tbody>
        </table>
      </ConditionalComponent>
    </div>
  )
}

export default ShippingMethods
