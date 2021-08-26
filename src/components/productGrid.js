import React, { useState } from 'react'
import axios from 'axios'
import { useSelector,useDispatch } from 'react-redux'
import { Link } from 'react-router-dom'

import ConditionalComponent from './conditionalComponent'
import { SHOW_LOADING, HIDE_LOADING, TRIGGER_RELOAD, ADD_GLOBAL_MESSAGE, SET_QUOTE_ID, SET_GUEST_CART_ID } from '../reducers/types'

import './productGrid.scss'

const ProductGrid = ({ products }) => {
  const [selectedSwatch, setSelectedSwatch] = useState({})

  const token = useSelector(state => state.token)
  const { quoteId: quoteIdState } = useSelector(state => state.cart)
  const { guestCartId } = useSelector(state => state.cart)

  const headers = {
    Authorization: `Bearer ${token}`
  }

  const dispatch = useDispatch()

  const onSubmit = async (e, { sku, name, type_id }) => {
    e.preventDefault()

    dispatch({ type: SHOW_LOADING })
    try {
      let quoteId = quoteIdState
      let cartEndpoint = '/carts/mine/items'
      if (token) {
        if (!quoteId) {
          const { data } = await axios.post('/carts/mine', {}, { headers })
  
          dispatch({ type: SET_QUOTE_ID, payload: data })
          quoteId = data
        }
      } else {
        if (guestCartId) {
          quoteId = guestCartId
        } else if (!token && !guestCartId) {
          const { data } = await axios.post('/guest-carts')
  
          quoteId = data
          dispatch({ type: SET_GUEST_CART_ID, payload: data })
        }
        cartEndpoint = `/guest-carts/${quoteId}/items`
      }

      const cartItem = {
        sku: sku,
        qty: 1,
        quoteId
      }

      if (type_id === 'configurable') {
        const configurable_item_options = (Object.keys(selectedSwatch[sku]) || []).map(swatch => ({
          option_id: swatch,
          option_value: selectedSwatch[sku][swatch]
        }))

        cartItem.product_option = {
          extension_attributes: { configurable_item_options }
        }
      }
  
      await axios.post(cartEndpoint, { cartItem }, { headers })
  
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

  const imgStyle = {
    width: '216px',
    height: '269px'
  }

  const onSwatchClick = (product, option, value) => {
    setSelectedSwatch({
      ...selectedSwatch,
      [product.sku]: {
        ...selectedSwatch[product.sku],
        [option.attribute_id]: value.value_index
      }
    })
  }

  const productsRender = products.map(product => {
    const swatchOptions = product.extension_attributes.configurable_product_options || []

    const swatchRender = swatchOptions.map(option => {
      const swatchValuesRender = option.values.map(value => {
        const isSelected = selectedSwatch[product.sku] && selectedSwatch[product.sku][option.attribute_id] === value.value_index

        if (option.label !== 'Color') {
          return (
            <div 
              onClick={() => onSwatchClick(product, option, value)}
              key={value.value_index}
              className={`swatch-option text ${isSelected ? 'selected' : ''}`}
            >{value.extension_attributes.label}</div>
          ) 
        }

        const colorStyle = {
          background: `${value.extension_attributes.label} no-repeat center`,
          backgroundSize: 'initial'
        }

        return (
          <div 
            onClick={() => onSwatchClick(product, option, value)}
            key={value.value_index}
            className={`swatch-option color ${isSelected ? 'selected' : ''}`}
            style={colorStyle} 
          />
        )
      })
      return (
        <div className={`swatch-attribute ${option.label.toLowerCase()}`} key={option.id}>
          <div className="swatch-attribute-options">
            {swatchValuesRender}
          </div>
        </div>
      )
    })

    const productPrice = product.type_id === 'configurable' ? product.extension_attributes.final_price : product.price

    return (
      <li key={product.id} className="item product product-item">
        <div className="product-item-info">
          <span className="product-image-container" style={{width: '240px'}}>
            <ConditionalComponent condition={!product.extension_attributes.is_in_stock}>
              <span className="product-image-out-of-stock">
                <img src='/sold-out.png' alt="out-of-stock" width="75" height="auto" /> 
              </span>
            </ConditionalComponent>
            <Link to={`/product/${product.sku}`}>
              <span className="product-image-wrapper">
                <img 
                  className="product-image-photo"
                  src={`${process.env.REACT_APP_PRODUCT_IMAGE}/${product.media_gallery_entries[0].file}`} 
                  alt={product.name} 
                  width="216"
                  height="269"
                  style={imgStyle}
                />
              </span>
            </Link>
          </span>
          <div className="product details product-item-details">
            <div className="product name product-item-name">
              {product.name}
            </div>
            <div className="price-box price-final_price">
              <span className="price-container price-final_price tax weee">
                <span id="product-price-14" className="price-wrapper ">
                  <span className="price">
                    {product.type_id === 'configurable' && 'As low as '}<strong>${(productPrice || 0).toFixed(2)}</strong>
                  </span>
                </span>
              </span>
            </div>
            <ConditionalComponent condition={product.type_id === 'configurable'}>
              <div className="swatch-options">
                {swatchRender}
              </div>
            </ConditionalComponent>
          </div>
        </div>
        <div className="product-item-inner">
          <div className="product actions product-item-actions">
            <div className="actions-primary">
              <form onSubmit={(e) => onSubmit(e, product)}>
                <button 
                  type="submit" 
                  title="Add to Cart" 
                  className="action tocart primary"
                  disabled={!product.extension_attributes.is_in_stock}
                >
                  <span>Add to Cart</span>
                </button>
              </form>
            </div>
          </div>
        </div>
      </li>
    )
  })

  return (
    <ol className="products list items product-items">
      {productsRender}
    </ol>
  )
}

export default ProductGrid
