import React, { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import axios from 'axios'

import ShowPerPage from '../../showPerPage'
import ConditionalComponent from '../../conditionalComponent'
import { SHOW_LOADING, HIDE_LOADING, TRIGGER_RELOAD, ADD_GLOBAL_MESSAGE, SET_QUOTE_ID } from '../../../reducers/types'

import './index.scss'

const Index = () => {
  const token = useSelector(state => state.token)
  const { quoteId: quoteIdState } = useSelector(state => state.cart)
  const limit = [12,24,36]
  const limitRender = limit.map(el => (
    <option value={el} key={el}>
      {el}
    </option>
  ))
  
  const [products, setProducts] = useState([])
  const [totalCount, setTotalCount] = useState(0)
  const { id } = useParams()
  const [params, setParams] = useState({
    pageSize: limit[0],
    page: 1
  })

  const headers = {
    Authorization: `Bearer ${token}`
  }

  const dispatch = useDispatch()

  const onSubmit = async (e, { sku, name }) => {
    e.preventDefault()

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

  const imgStyle = {
    width: '216px',
    height: '269px'
  }

  const productsRender = products.map(product => (
    <li key={product.id} className="item product product-item">
      <div className="product-item-info">
        <span className="product-image-container" style={{width: '240px'}}>
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
        </span>
        <div className="product details product-item-details">
          <div className="product name product-item-name">
            {product.name}
          </div>
          <div className="price-box price-final_price">
            <span className="price-container price-final_price tax weee">
              <span id="product-price-14" className="price-wrapper ">
                <span className="price">
                  <strong>${(product.price && product.price.toFixed(2)) || '0.00'}</strong>
                </span>
              </span>
            </span>
          </div>                                      
          <div className="product-item-inner">
            <div className="product actions product-item-actions">
              <div className="actions-primary">
                <form onSubmit={(e) => onSubmit(e, product)}>
                  <button type="submit" title="Add to Cart" className="action tocart primary">
                    <span>Add to Cart</span>
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </li>
  ))

  useEffect(() => {
    const fetchProducts = async () => {
      dispatch({ type: SHOW_LOADING })
      const { data } = await axios.get(`/products`, {
        params: {
          'searchCriteria[filter_groups][0][filters][0][field]': 'category_id',
          'searchCriteria[filter_groups][0][filters][0][value]': id,
          'searchCriteria[filter_groups][0][filters][0][condition_type]': 'eq',
          'searchCriteria[filter_groups][1][filters][0][field]': 'visibility',
          'searchCriteria[filter_groups][1][filters][0][value]': '[2,4]',
          'searchCriteria[filter_groups][1][filters][0][condition_type]': 'in',
          'searchCriteria[filter_groups][2][filters][0][field]': 'status',
          'searchCriteria[filter_groups][2][filters][0][value]': '1',
          'searchCriteria[filter_groups][2][filters][0][condition_type]': 'eq',
          'searchCriteria[pageSize]': params.pageSize,
          'searchCriteria[currentPage]': params.page
        }
      })

      setProducts(data.items)
      setTotalCount(data.total_count)
      dispatch({ type: HIDE_LOADING })
    }

    fetchProducts()
  }, [id, dispatch, params])

  return (
    <div>
      <ConditionalComponent condition={products.length > 0}>
        <div className="products wrapper grid products-grid">
          <ol className="products list items product-items">
            {productsRender}
          </ol>
        </div>
        <ShowPerPage 
          params={params} 
          setParams={setParams}
          totalCount={totalCount}
          limitRender={limitRender}
        /> 
      </ConditionalComponent>
      <ConditionalComponent condition={products.length === 0}>
        <div className="empty-content">
          Products not found
        </div>
      </ConditionalComponent>
    </div>
  )
}

export default Index
