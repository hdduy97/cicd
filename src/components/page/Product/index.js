import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { useParams } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import "react-responsive-carousel/lib/styles/carousel.min.css"
import { Carousel } from 'react-responsive-carousel'

import { SHOW_LOADING, HIDE_LOADING, ADD_GLOBAL_MESSAGE, SET_QUOTE_ID, TRIGGER_RELOAD, SET_GUEST_CART_ID } from '../../../reducers/types'

import './index.scss'

const Index = () => {
  const { sku } = useParams()

  const [product, setProduct] = useState({})
  const [loaded, setLoaded] = useState(false)
  const [selectedSwatch, setSelectedSwatch] = useState({})
  const [qty, setQty] = useState(1)

  const token = useSelector(state => state.token)
  const { quoteId: quoteIdState } = useSelector(state => state.cart)
  const { guestCartId } = useSelector(state => state.cart)

  const headers = !token ? {} : {
    Authorization: `Bearer ${token}`
  }

  const dispatch = useDispatch()

  const onSwatchClick = (product, option, value) => {
    setSelectedSwatch({
      ...selectedSwatch,
      [product.sku]: {
        ...selectedSwatch[product.sku],
        [option.attribute_id]: value.value_index
      }
    })
  }

  const swatchOptions = (product.id && product.extension_attributes.configurable_product_options) || []

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
        <span className="option-label"><strong>{option.label}</strong></span>
        <div className="swatch-attribute-options">
          {swatchValuesRender}
        </div>
      </div>
    )
  })

  const productImagesRender = (product.media_gallery_entries || []).map(image => (
    <div key={image.id}>
      <img
        src={`${process.env.REACT_APP_PRODUCT_IMAGE}/${image.file}`}
        alt={`${product.name}`}
        width="100%"
        height="auto"
      />
    </div>
  ))

  const addToCart = async (e) => {
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
        sku: product.sku,
        qty: qty,
        quoteId
      }

      if (product.type_id === 'configurable') {
        const configurable_item_options = (Object.keys(selectedSwatch[product.sku]) || []).map(swatch => ({
          option_id: swatch,
          option_value: selectedSwatch[product.sku][swatch]
        }))

        cartItem.product_option = {
          extension_attributes: { configurable_item_options }
        }
      }
  
      await axios.post(cartEndpoint, { cartItem }, { headers })
  
      dispatch({ type: TRIGGER_RELOAD })
      dispatch({ type: ADD_GLOBAL_MESSAGE, payload: { 
        isSuccess: true, 
        message: `You added ${product.name} to your shopping cart`
      }})
    } catch(e) {
      dispatch({ type: ADD_GLOBAL_MESSAGE, payload: { isSuccess: false, message: e.response.data.message }})
      dispatch({ type: HIDE_LOADING })
    }
  }

  useEffect(() => {
    const fetchProductData = async () => {
      try {
        dispatch({ type: SHOW_LOADING })
        
        const { data } = await axios.get(`/products/${sku}`)
        setProduct(data)
      } catch(e) {

      }

      setLoaded(true)

      dispatch({ type: HIDE_LOADING })
    }

    fetchProductData()
  }, [sku, dispatch])

  if (!loaded) return null

  if (!product.id) return <h1>Product not found</h1>

  return (
    <div>
      <div className="product-information">
        <Carousel>
          {productImagesRender}
        </Carousel>
        <div className="product-info-main">
          <h1 className="product-name">{product.name}</h1>
          <div className="product-info-price">
            <div className="product-price">${product.extension_attributes.final_price}</div>
            <div className="stock-sku">SKU#:{product.sku}</div>
          </div>
          <form onSubmit={addToCart}>
            <div className="field">
              {swatchRender}
            </div>
            <div className="field qty">
              <label>Qty</label>
              <input value={qty} onChange={e => setQty(e.target.value)} type="number" />
            </div>
            <div className="product-actions">
              <button
                className="action primary"
                type="submit"
                disabled={!product.extension_attributes.is_in_stock}
              >Add to Cart</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default Index
