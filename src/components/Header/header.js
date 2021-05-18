import React, { useState, useEffect } from 'react'
import { Link, useHistory } from 'react-router-dom'
import { useSelector } from 'react-redux'
import axios from 'axios'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faShoppingCart } from '@fortawesome/free-solid-svg-icons'
import ConditionalComponent from '../conditionalComponent'
import PopupBlock from '../popupBlock'
import CartItem from './cartItem'

import './header.scss'

const Header = ({ logo }) => {
  const [search, setSearch] = useState('')
  const [cartItems, setCartItems] = useState([])
  const [cartTotals, setCartTotals] = useState({})
  const [isCartShow, setIsCartShow] = useState(false)

  const token = useSelector(state => state.token)
  const reloadCart = useSelector(state => state.reloadCart)

  const totalCartItems = cartItems.reduce((a,b) => a + b.qty, 0)

  const onSearchSubmit = (e) => {
    e.preventDefault()

    console.log(search)
  }

  const cartItemsRender = cartItems.map(item => {
    return (
      <li key={item.sku} className="item">
        <CartItem item={item} />
      </li>
    )
  })

  const history = useHistory()

  const onCheckoutBtnClick = () => {
    setIsCartShow(false)
    history.push('/checkout')
  }
  
  useEffect(() => {
    const headers = {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json'
    }

    const restUrl = process.env.REACT_APP_RESTURL

    const fetchCartItems = async () => {
      try {
        const [{ data: items }, { data: totals }] = await axios.all([
          axios.get(restUrl + '/carts/mine/items', { headers }),
          axios.get(restUrl + '/carts/mine/totals', { headers })
        ])

        setCartItems(items)
        setCartTotals(totals)
      } catch(e) {

      }
    }

    fetchCartItems()
  }, [token, reloadCart])

  if (!logo || !logo.src) return null

  return (
    <div className="header content">
      <div className="logo">
        <Link to="/" className="logo">
          <img 
            src={logo.src}
            width={logo.width > 0 ? logo.width : ''}
            height={logo.height > 0 ? logo.height : ''}
            alt={logo.alt > 0 ? logo.alt : ''}
          />
        </Link>
      </div>
      <div className="block-right">
        <div className="block block-search">
          <form onSubmit={onSearchSubmit}>
            <input 
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search entire store here..."
            />
          </form>
        </div>
        <div className="minicart-wrapper">
          <div className="cart" onClick={() => setIsCartShow(!isCartShow)}>
            <span className="cart-icon"><FontAwesomeIcon icon={faShoppingCart} /></span>
            <ConditionalComponent condition={totalCartItems > 0}>
              <span className="counter qty">
                  <span className="counter-number">
                    {totalCartItems}
                  </span>
              </span>
            </ConditionalComponent>
          </div>
          <ConditionalComponent condition={isCartShow}>
            <PopupBlock setShowComponent={setIsCartShow}>
              <div className="cart-dropdown">
                <div className="minicart-content-wrapper">
                  <ConditionalComponent condition={totalCartItems > 0}>
                    <div className="total">
                      <div className="items-total">
                        <strong>{totalCartItems}</strong> Item{totalCartItems > 1 ? 's' : ''} in Cart
                      </div>
                      <div className="subtotal">
                        <div className="label">Cart Subtotal:</div>
                        <div className="amount price-container">
                          <span className="price-wrapper">${cartTotals.grand_total && cartTotals.grand_total.toFixed(2)}</span>
                        </div>
                      </div>
                    </div>
                    <div className="actions">
                      <div className="primary" onClick={onCheckoutBtnClick}>
                        <span className="btn-checkout">Proceed to Checkout</span>
                      </div>
                    </div>
                    <div className="minicart-items-wrapper">
                      <ol className="minicart-items">
                        {cartItemsRender}
                      </ol>
                    </div>
                  </ConditionalComponent>
                </div>
              </div>
            </PopupBlock>
          </ConditionalComponent>
        </div>
      </div>
    </div>
  )
}

export default Header
