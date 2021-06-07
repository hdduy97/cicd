import React, { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import axios from 'axios'

import ShowPerPage from '../../showPerPage'
import ProductGrid from '../../productGrid'
import ConditionalComponent from '../../conditionalComponent'
import { SHOW_LOADING, HIDE_LOADING, ADD_GLOBAL_MESSAGE } from '../../../reducers/types'

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

  const dispatch = useDispatch()

  useEffect(() => {
    const fetchProducts = async () => {
      dispatch({ type: SHOW_LOADING })

      try {
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
      } catch(e) {
        dispatch({ type: ADD_GLOBAL_MESSAGE, payload: { isSuccess: false, message: e.response.data.message }})
      }

      dispatch({ type: HIDE_LOADING })
    }

    fetchProducts()
  }, [id, dispatch, params])

  return (
    <div>
      <ConditionalComponent condition={products.length > 0}>
        <div className="products wrapper grid products-grid">
          <ProductGrid products={products} />
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
