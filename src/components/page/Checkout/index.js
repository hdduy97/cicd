import React, { useState, useEffect } from 'react'
import { useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import axios from 'axios'

import ShippingAddress from './shippingAddress'
import ShippingMethods from './shippingMethods'
import PaymentMethod from './paymentMethod'
import ConditionalComponent from '../../conditionalComponent'
import './index.scss'
const Index = () => {
  // Steps
  // 1. SHIPPING_ADDRESS
  // 2. SHIPPING_METHOD
  // 3. PAYMENT
  // 4. PAYMENT SUCCESS
  
  const [step, setStep] = useState(1)
  const [countries, setCountries] = useState([])
  const [shippingMethods, setShippingMethods] = useState([])
  const [paymentMethods, setPaymentMethods] = useState([])
  const [address, setAddress] = useState({})
  const [totals, setTotals] = useState({})
  const [selectedShippingMethod, setSelectedShippingMethod] = useState({})
  const [orderResponse, setOrderResponse] = useState({})

  const { items } = useSelector(state => state.cart)
  const token = useSelector(state => state.token)
  const customer = useSelector(state => state.customer)

  const totalCartItems = items.reduce((a,b) => a + b.qty, 0)

  useEffect(() => {
    const fetchCountries = async () => {
      try {
        const { data } = await axios.get('/directory/countries')

        setCountries(data.filter(el => el.full_name_english).sort((a,b) => a.full_name_english > b.full_name_english ? 1 : -1))
      } catch(e) {}
    }

    fetchCountries()
  }, [])

  const itemsRender = items.map(item => {
    return (
      <li key={item.sku} className="cart-item">
        <span className="product-image-container" style={{ width: '75px' }}>
          <span className="product-image-wrapper">
            <img 
              className="product-image-photo"
              src={`${process.env.REACT_APP_PRODUCT_IMAGE}/${item.extension_attributes.thumbnail}`}
              alt={item.name} 
            />
          </span>
        </span>
        <div className="product-item-details">
          <div className="product-item-name">{item.name}</div>
          <div className="product-item-modify">
            <div className="product-item-qty">
              <label>Qty: {item.qty}</label>
            </div>
          </div>
          <div className="product-item-pricing"><strong>${(item.qty * item.price).toFixed(2)}</strong></div>
        </div>
      </li>
    )
  })

  return (
    <>
      <ConditionalComponent condition={step < 4}>
        <div className="checkout">
          <div className="checkout-block">
            <ShippingAddress 
              countries={countries}
              step={step}
              setStep={setStep}
              token={token}
              customer={customer}
              setShippingMethods={setShippingMethods}
              setAddress={setAddress}
            />
            <ConditionalComponent condition={step >= 2}>
              <ShippingMethods 
                step={step}
                setStep={setStep}
                methods={shippingMethods}
                address={address}
                token={token}
                setPaymentMethods={setPaymentMethods}
                setTotals={setTotals}
                setSelectedShippingMethod={setSelectedShippingMethod}
              />
            </ConditionalComponent>
            <ConditionalComponent condition={step === 3}>
              <PaymentMethod methods={paymentMethods} token={token} setStep={setStep} setOrderResponse={setOrderResponse} />
            </ConditionalComponent>
          </div>
          <div className="order-summary">
            <span className="title">Order Summary</span>
            <ConditionalComponent condition={step === 3}>
              <table className="table-totals">
                <tbody>
                  <tr>
                    <th className="mark">Cart Subtotal</th>
                    <td className="amount"><span>${totals.subtotal && totals.subtotal.toFixed(2)}</span></td>
                  </tr>
                  <ConditionalComponent condition={totals.discount_amount < 0}>
                    <tr>
                      <th className="mark">Discount</th>
                      <td className="amount"><span>-${totals.discount_amount && Math.abs(totals.discount_amount).toFixed(2)}</span></td>
                    </tr>
                  </ConditionalComponent>
                  <tr>
                    <th className="mark">
                      <span>Shipping</span>
                      <span className="value">{`${selectedShippingMethod.carrier_title} - ${selectedShippingMethod.method_title}`}</span>
                    </th>
                    <td className="amount"><span>${totals.shipping_amount && totals.shipping_amount.toFixed(2)}</span></td>
                  </tr>
                  <tr className="grand totals">
                    <th className="mark">
                      <strong>Order Total</strong>
                    </th>
                    <td className="amount">
                      <strong>
                        <span>${totals.grand_total && totals.grand_total.toFixed(2)}</span>
                      </strong>
                    </td>
                  </tr>
                </tbody>
              </table>
            </ConditionalComponent>
            <div className="items-in-cart">
              <span className="title">{`${totalCartItems} Items in Cart`}</span>
              <div className="minicart-items">
                <div className="minicart-items-wrapper">
                  <ol className="minicart-items">
                    {itemsRender}
                  </ol>
                </div>
              </div>
            </div>
          </div>
        </div>
      </ConditionalComponent>
      <ConditionalComponent condition={step === 4}>
        <div className="page-title-wrapper">
          <h1 className="page-title">
            <span className="base" data-ui-id="page-title-wrapper">Thank you for your purchase!</span>
          </h1>
        </div>
        <div className="checkout-success">
          <p>Your order number is: <Link to="sales/order/history" className="order-number"><strong>{orderResponse.increment_id}</strong></Link>.</p>
          <p>We'll email you an order confirmation with details and tracking info.</p>
          <div className="actions-toolbar">
            <div className="primary">
              <Link className="action primary continue" to="/"><span>Continue Shopping</span></Link>
            </div>
          </div>
        </div>
      </ConditionalComponent>
    </>
  )
}

export default Index
