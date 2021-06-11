import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { useParams } from 'react-router-dom'
import { useDispatch } from 'react-redux'

import { SHOW_LOADING, HIDE_LOADING, ADD_GLOBAL_MESSAGE } from '../../../reducers/types'

import './index.scss'

const Index = () => {
  const { sku } = useParams()

  const [product, setProduct] = useState({})
  const [loaded, setLoaded] = useState(false)
  const [selectedSwatch, setSelectedSwatch] = useState({})
  const [qty, setQty] = useState(1)

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

  useEffect(() => {
    const fetchProductData = async () => {
      try {
        dispatch({ type: SHOW_LOADING })
        
        const { data } = await axios.get(`/products/${sku}`)
        setProduct(data)

        console.log(data)
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
        <div className="product-thumnail">
          <img
            src={`${process.env.REACT_APP_PRODUCT_IMAGE}/${product.media_gallery_entries[0].file}`}
            alt={`${product.name}`}
            width="100%"
            height="auto"
          />
        </div>
        <div className="product-info-main">
          <h1 className="product-name">{product.name}</h1>
          <div className="product-info-price">
            <div className="product-price">${product.price}</div>
            <div className="stock-sku">SKU#:{product.sku}</div>
          </div>
          <div className="abc">
            {swatchRender}
          </div>
          <div className="qty">
            <label>Qty</label>
            <input value={qty} onChange={e => setQty(e.target.value)} type="number" />
          </div>
        </div>
      </div>
    </div>
  )
}

export default Index
