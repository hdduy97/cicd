import React, { useState } from 'react'
import { useDispatch } from 'react-redux'
import axios from 'axios'

import { ADD_GLOBAL_MESSAGE, SHOW_LOADING, HIDE_LOADING, TRIGGER_RELOAD } from '../../../reducers/types'

const PaymentMethod = ({ methods, token, setStep }) => {
  const [selectedMethod, setSelectedMethod] = useState(methods.length > 0 ? methods[0].code : '')

  const paymentMethodsRender = methods.map(method => (
    <tr key={method.code} onClick={() => setSelectedMethod(method.code)}>
      <td>
        <input type="radio" 
          value={method.code}
          checked={method.code === selectedMethod}
          onChange={() => setSelectedMethod(method.code)}
        />
      </td>
      <td>
        {method.title}
      </td>
    </tr>
  ))

  const dispatch = useDispatch()

  const headers = {
    Authorization: `Bearer ${token}`
  }

  const onSubmit = async (e) => {
    e.preventDefault()

    dispatch({ type: SHOW_LOADING })

    try {
      await axios.post('/carts/mine/payment-information', {
        paymentMethod: {
          method: selectedMethod
        }
      }, { headers })

      setStep(4)
      dispatch({ type: TRIGGER_RELOAD })
    } catch(e) {
      dispatch({ type: ADD_GLOBAL_MESSAGE, payload: { isSuccess: false, message: e.response.data.message }})
      dispatch({ type: HIDE_LOADING })
    }
  }
  
  return (
    <div className="checkout-step">
      <div className="step-title">Payment Method</div>
      <form onSubmit={onSubmit}>
        <div className="payment-methods">
          <table className="table-checkout-shipping-method">
            <tbody>
              {paymentMethodsRender}
            </tbody>
          </table>
        </div>
        <div className="form-actions">
          <button className="action primary checkout">Place Order</button>
        </div>
      </form>
    </div>
  )
}

export default PaymentMethod
