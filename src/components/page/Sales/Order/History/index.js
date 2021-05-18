import React, { useState, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import axios from 'axios'
import moment from 'moment'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faExclamationTriangle } from '@fortawesome/free-solid-svg-icons'
import Layout from '../../../Customer/Account/layout'
import ConditionalComponent from '../../../../conditionalComponent'
import ShopPerPage from '../../../../showPerPage'

import { ADD_GLOBAL_MESSAGE, SHOW_LOADING, HIDE_LOADING } from '../../../../../reducers/types'

import './index.scss'

const Index = () => {
  const limit = [10,20,50]
  const limitRender = limit.map(el => (
    <option value={el} key={el}>
      {el}
    </option>
  ))

  const [orders, setOrders] = useState([])
  const [totalCount, setTotalCount] = useState(0)
  const [loading, setLoading] = useState(true)
  const [params, setParams] = useState({
    pageSize: limit[0],
    page: 1
  })

  const dispatch = useDispatch()

  const ordersRender = orders.map(order => (
    <tr key={order.entity_id}>
      <td data-th="Order #" className="col id">{ order.increment_id }</td>
      <td data-th="Date" className="col date">{ moment(order.created_at).format('M/D/YY') }</td>
      <td data-th="Ship To" className="col shipping">customer three</td>
      <td data-th="Order Total" className="col total"><span className="price">${ order.base_grand_total.toFixed(2) }</span></td>
      <td data-th="Status" className="col status">{ order.status }</td>
      <td data-th="Actions" className="col actions">
        <a href={`https://demo.lotustest.net/sales/order/view/order_id/${order.entity_id}/`} className="action view">
          <span>View Order</span>
        </a>
        <a href={`https://demo.lotustest.net/sales/order/view/order_id/${order.entity_id}/`} data-post="{&quot;action&quot;:&quot;https:\/\/demo.lotustest.net\/sales\/order\/reorder\/order_id\/4\/&quot;,&quot;data&quot;:{&quot;uenc&quot;:&quot;aHR0cHM6Ly9kZW1vLmxvdHVzdGVzdC5uZXQvc2FsZXMvb3JkZXIvaGlzdG9yeS8,&quot;}}" className="action order">
          <span>Reorder</span>
        </a>
      </td>
    </tr>
  ))

  const token = useSelector(state => state.token)

  useEffect(() => {
    const fetchOrders = async () => {
      dispatch({ type: SHOW_LOADING })
      try {
        const { data: ordersResponse } = await axios.get(process.env.REACT_APP_RESTURL + '/customers/me/orders', {
          headers: {
            Authorization: `bearer ${token}`
          },
          params
        })
  
        setOrders(ordersResponse.items)
        setTotalCount(ordersResponse.total_count)
      } catch(e) {
        dispatch({ type: ADD_GLOBAL_MESSAGE, payload: { isSuccess: false, message: e.response.data.message }})
      }
      dispatch({ type: HIDE_LOADING })
      setLoading(false)
    }

    fetchOrders()
  }, [token, dispatch, params])
  return (
    <Layout>
      <div className="page-title-wrapper">
        <h1 className="page-title"><span>My Orders</span></h1>
      </div>
      <ConditionalComponent condition={totalCount > 0}>
        <div className="table-wrapper orders-history">
          <table className="data table table-order-items history" id="my-orders-table">
            <thead>
              <tr>
                <th scope="col" className="col id">Order #</th>
                <th scope="col" className="col date">Date</th>
                <th scope="col" className="col shipping">Ship To</th>
                <th scope="col" className="col total">Order Total</th>
                <th scope="col" className="col status">Status</th>
                <th scope="col" className="col actions">Action</th>
              </tr>
            </thead>
            <tbody>
              {ordersRender}
            </tbody>
          </table>
        </div>
        <ShopPerPage
          params={params} 
          setParams={setParams}
          totalCount={totalCount}
          limitRender={limitRender}
        />
      </ConditionalComponent>
      <ConditionalComponent condition={totalCount === 0} loading={loading}>
        <div className="message info empty">
          <span className="icon"><FontAwesomeIcon icon={faExclamationTriangle} /></span>
          <span>You have placed no orders.</span>
        </div>
      </ConditionalComponent>
    </Layout>
  )
}

export default Index
