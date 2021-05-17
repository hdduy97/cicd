import React, { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import axios from 'axios'

import ShowPerPage from '../../showPerPage'

import { SHOW_LOADING, HIDE_LOADING } from '../../../reducers/types'

import './index.scss'

const Index = () => {
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

  const productsRender = products.map(product => (
    <li key={product.id} className="item product product-item">
      <div className="product-item-info">
        <span className="product-image-container" style={{width: '240px'}}>
          <span className="product-image-wrapper" style={{paddingBottom: '125%'}}>
            <img className="product-image-photo" src={`https://demo.lotustest.net/pub/media/catalog/product${product.media_gallery_entries[0].file}`} alt={product.name} />
          </span>
        </span>
        <div className="product details product-item-details">
          <div className="product name product-item-name">
            {product.name}
          </div>
          <div className="price-box price-final_price">
            <span className="price-container price-final_price tax weee">
              <span id="product-price-14" className="price-wrapper ">
                <span className="price">${product.price}</span>
              </span>
            </span>
          </div>                                      
          <div className="product-item-inner">
            <div className="product actions product-item-actions">
              <div className="actions-primary">
                <form>
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

  const dispatch = useDispatch()

  useEffect(() => {
    const fetchProducts = async () => {
      dispatch({ type: SHOW_LOADING })
      const { data } = await axios.get(`${process.env.REACT_APP_RESTURL}/products`, {
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
    </div>
  )
}

export default Index
