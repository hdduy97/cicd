import React, { useState, useEffect } from 'react'
import { Link, useHistory } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import axios from 'axios'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faShoppingCart } from '@fortawesome/free-solid-svg-icons'
import ConditionalComponent from '../conditionalComponent'
import PopupBlock from '../popupBlock'
import CartItem from './cartItem'

import { SHOW_LOADING, HIDE_LOADING, SET_CART, RESET_CART, ADD_GLOBAL_MESSAGE, TRIGGER_RELOAD, SET_QUOTE_ID } from '../../reducers/types'

import './header.scss'

const Header = ({ logo }) => {
  const [search, setSearch] = useState('')
  const [isCartShow, setIsCartShow] = useState(false)
  const [searchTimeout, setSearchTimeout] = useState(null)
  const [searchProducts, setSearchProducts] = useState([])
  const [isSearchProductsShow, setIsSearchProductsShow] = useState(false)
  
  const { items, totals, reloadCart } = useSelector(state => state.cart)
  const token = useSelector(state => state.token)
  const { quoteId: quoteIdState } = useSelector(state => state.cart)

  const dispatch = useDispatch()

  const totalCartItems = items.reduce((a,b) => a + b.qty, 0)

  const onSearchSubmit = (e) => {
    e.preventDefault()
  }

  const cartItemsRender = items.map(item => {
    return (
      <li key={item.sku} className="item">
        <CartItem item={item} />
      </li>
    )
  })

  const headers = {
    Authorization: `Bearer ${token}`
  }

  const addToCart = async ({ sku, name }) => {
    dispatch({ type: SHOW_LOADING })
    try {
      let quoteId = quoteIdState
      if (!quoteId) {
        const { data } = await axios.post('/carts/mine', {}, { headers })

        dispatch({ type: SET_QUOTE_ID, payload: data })
        quoteId = data
      }
      const cartItem = {
        sku,
        qty: 1,
        quoteId
      }
  
      await axios.post('/carts/mine/items', { cartItem }, { headers })
  
      dispatch({ type: TRIGGER_RELOAD })
      dispatch({ type: ADD_GLOBAL_MESSAGE, payload: { 
        isSuccess: true, 
        message: `You added ${name} to your shopping cart`
      }})
    } catch(e) {
      dispatch({ type: ADD_GLOBAL_MESSAGE, payload: { isSuccess: false, message: e.response.data.message }})
      dispatch({ type: HIDE_LOADING })
    }
  }

  const searchProductsRender = searchProducts.map(product => (
    <li key={product.sku} className="item" onClick={() => addToCart(product)}>
      <span className="product-image-container" style={{ width: '45px' }}>
        <span className="product-image-wrapper">
          <img 
            className="product-image-photo"
            src={`${process.env.REACT_APP_PRODUCT_IMAGE}/${product.media_gallery_entries[0].file}`}
            alt={product.name} 
          />
        </span>
      </span>
      <span className="product-name">{product.name}</span>
      <span className="product-price"><strong>${product.price && product.price.toFixed(2)}</strong></span>
    </li>
  ))

  const history = useHistory()

  const onCheckoutBtnClick = () => {
    setIsCartShow(false)
    history.push('/checkout')
  }

  const onSearchInputChange = (e) => {
    const { value } = e.target
    setSearch(value)

    clearTimeout(searchTimeout)
    setSearchTimeout(null)

    if (value) {
      setSearchTimeout(setTimeout(async () => {
        const { data } = await axios.get(`/products`, {
          params: {
            'searchCriteria[filter_groups][0][filters][0][field]': 'name',
            'searchCriteria[filter_groups][0][filters][0][value]': `%${value}%`,
            'searchCriteria[filter_groups][0][filters][0][condition_type]': 'like',
            'searchCriteria[filter_groups][0][filters][1][field]': 'sku',
            'searchCriteria[filter_groups][0][filters][1][value]': `%${value}%`,
            'searchCriteria[filter_groups][0][filters][1][condition_type]': 'like',
            'searchCriteria[filter_groups][1][filters][0][field]': 'visibility',
            'searchCriteria[filter_groups][1][filters][0][value]': '[2,4]',
            'searchCriteria[filter_groups][1][filters][0][condition_type]': 'in',
            'searchCriteria[filter_groups][2][filters][0][field]': 'status',
            'searchCriteria[filter_groups][2][filters][0][value]': '1',
            'searchCriteria[filter_groups][2][filters][0][condition_type]': 'eq',
            'searchCriteria[pageSize]': 5
          }
        })
  
        setIsSearchProductsShow(true)
        setSearchProducts(data.items)
      }, 500))
    } else {
      setIsSearchProductsShow(false)
    }
  }
  
  useEffect(() => {
    const headers = {
      Authorization: `Bearer ${token}`
    }

    const fetchCartItems = async () => {
      try {
        const [{ data: items }, { data: totals }] = await axios.all([
          axios.get('/carts/mine/items', { headers }),
          axios.get('/carts/mine/totals', { headers })
        ])

        if (Array.isArray(items)) {
          dispatch({ type: SET_CART, payload: {items, totals} })
        }
      } catch(e) {
        dispatch({ type: RESET_CART })
      }

      dispatch({ type: HIDE_LOADING })
    }

    if (token) fetchCartItems()
  }, [token, reloadCart, dispatch])

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
              onChange={onSearchInputChange}
              onClick={() => setIsSearchProductsShow(true)}
              placeholder="Search entire store here..."
            />
          </form>
          <ConditionalComponent condition={isSearchProductsShow}>
            <PopupBlock setShowComponent={setIsSearchProductsShow}>
              <div className="search-products">
                <ConditionalComponent condition={isSearchProductsShow}>
                  <ul className="items">{searchProductsRender}</ul>
                </ConditionalComponent>
              </div>
            </PopupBlock>
          </ConditionalComponent>
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
                          <span className="price-wrapper">${totals.subtotal && totals.subtotal.toFixed(2)}</span>
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
                  <ConditionalComponent condition={items.length === 0}>
                    <div className="empty-cart">You have no items in your shopping cart.</div>
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
