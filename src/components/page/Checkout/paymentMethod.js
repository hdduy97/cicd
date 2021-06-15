import React, { useState } from 'react'
import { useDispatch } from 'react-redux'
import axios from 'axios'

import { ADD_GLOBAL_MESSAGE, SHOW_LOADING, HIDE_LOADING, RESET_CART, SET_CUSTOMER } from '../../../reducers/types'

const PaymentMethod = ({ methods, headers, setStep, setIncrementId, cartsMineEndpoint, guestEmail }) => {
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

  const onSubmit = async (e) => {
    e.preventDefault()

    dispatch({ type: SHOW_LOADING })

    try {
      const paymentData = {
        paymentMethod: {
          method: selectedMethod
        }
      }
      if (guestEmail.length > 0) paymentData.email = guestEmail

      const { data: orderId } = await axios.post(`${cartsMineEndpoint}/payment-information`, paymentData, { headers })
      const { data: incrementId } = await axios.get(`orders/${orderId}/incrementId`)

      setIncrementId(incrementId)

      if (headers.authorization) {
        const { data: customerResponse } = await axios.get('/customers/me', { headers })
        dispatch({ type: SET_CUSTOMER, payload: customerResponse })
      }

      setStep(4)
      dispatch({ type: RESET_CART })
    } catch(e) {
      dispatch({ type: ADD_GLOBAL_MESSAGE, payload: { isSuccess: false, message: e.response.data.message }})
    }
    
    dispatch({ type: HIDE_LOADING })
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
