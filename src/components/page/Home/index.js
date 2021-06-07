import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { useDispatch } from 'react-redux'
import parse from 'html-react-parser'

import ProductGrid from '../../productGrid'
import ConditionalComponent from '../../conditionalComponent'
import { SHOW_LOADING, HIDE_LOADING, ADD_GLOBAL_MESSAGE } from '../../../reducers/types'

import './index.scss'

const Index = () => {
  const [content, setContent] = useState('')
  const [bestSellers, setBestSellers] = useState([])

  const dispatch = useDispatch()

  useEffect(() => {
    const fetchContent = async () => {
      const homepageRequest = axios.get('/cmsPage/2')
      const bestSellersRequest = axios.get('/bestsellers')

      dispatch({ type: SHOW_LOADING })
      
      try {
        const [{ data: homepageResponse }, { data: bestSellersResponse }] = await axios.all([homepageRequest, bestSellersRequest])
        setContent(homepageResponse.content)
        setBestSellers(bestSellersResponse)
      } catch(e) {
        dispatch({ type: ADD_GLOBAL_MESSAGE, payload: { isSuccess: false, message: e.response.data.message }})
      }

      dispatch({ type: HIDE_LOADING })
    }

    fetchContent()
  }, [dispatch])

  return (
    <div className="empty-content">
      {parse(content)}
      <ConditionalComponent condition={bestSellers.length > 0}>
        <div class="content-heading">
          <h2 class="title">Hot Sellers</h2>
          <p class="info">Here is what`s trending on Luma right now</p>
        </div>
        <div className="products wrapper grid products-grid">
          <ProductGrid products={bestSellers} />
        </div>
      </ConditionalComponent>
    </div>
  )
}

export default Index
