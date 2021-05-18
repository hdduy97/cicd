import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import axios from 'axios'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTrashAlt } from '@fortawesome/free-solid-svg-icons'
import ConditionalComponent from '../conditionalComponent'

import { ADD_GLOBAL_MESSAGE, TRIGGER_RELOAD, SHOW_LOADING, HIDE_LOADING } from '../../reducers/types'
import './cartItem.scss'

const CartItem = ({ item }) => {
  const [qty, setQty] = useState(item.qty)
  const token = useSelector(state => state.token)

  const onQtyBlur = () => {
    if (!qty || +qty === 0) setQty(item.qty)
  }

  const dispatch = useDispatch()

  const onSubmit = async (e) => {
    e.preventDefault()

    const headers = {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json'
    }

    dispatch({ type: SHOW_LOADING })

    try {
      const { data: quoteId } = await axios.post(process.env.REACT_APP_RESTURL + '/carts/mine', {}, { headers })

      await axios.put(process.env.REACT_APP_RESTURL + '/carts/mine/items/' + item.item_id, 
        {
          cartItem: {
            qty,
            quoteId
          }
        },
        { headers }
      )

      dispatch({ type: TRIGGER_RELOAD })
    } catch(e) {
      dispatch({ type: ADD_GLOBAL_MESSAGE, payload: { isSuccess: false, message: e.response.data.message }})
    }
    dispatch({ type: HIDE_LOADING })
  }

  return (
    <form className="cart-item" onSubmit={onSubmit}>
      <span className="product-image-container" style={{ width: '75px' }}>
        <span className="product-image-wrapper">
          <img 
            className="product-image-photo"
            src="https://demo.lotustest.net/pub/media/catalog/product/cache/abd70257b1886fc2d9dc8a4db8a32ed4/m/b/mb05-black-0.jpg"
            alt={item.name} 
          />
        </span>
      </span>
      <div className="product-item-details">
        <div className="product-item-name">{item.name}</div>
        <div className="product-item-pricing"><strong>${item.price.toFixed(2)}</strong></div>
        <div className="product-item-modify">
          <div className="product-item-qty">
            <label>Qty:</label>
            <input value={qty} onBlur={onQtyBlur} onChange={e => setQty(e.target.value)} type="number" />
            <ConditionalComponent condition={qty > 0 && +qty !== +item.qty}>
              <button className="update-cart-item" title="Update">Update</button>
            </ConditionalComponent>
          </div>
          <div className="product-actions">
            <span><FontAwesomeIcon icon={faTrashAlt} /></span>
          </div>
        </div>
      </div>
    </form>
  )
}

export default CartItem
