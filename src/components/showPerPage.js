import React from 'react'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faChevronRight, faChevronLeft, faChevronDown } from '@fortawesome/free-solid-svg-icons'
import ConditionalComponent from './conditionalComponent'

import './showPerPage.scss'

const ShopPerPage = ({ params, setParams, totalCount, limitRender }) => {
  const totalPage = Math.ceil(totalCount/params.pageSize)

  const pagesRender = Array.from({ length: totalPage }).map((_, index) => {
    const p = index + 1
    return (
      <li className={`item ${p === params.page ? 'current' : ''}`} key={p} onClick={() => setParams({...params, page: p})}>
        <span>{p}</span>
      </li>
    )
  })

  const lastItem = params.page * params.pageSize

  const toolbarNumber = totalCount > params.pageSize
    ? `Items ${(params.page - 1) * params.pageSize + 1} to ${lastItem > totalCount ? totalCount : lastItem} of ${totalCount} total`
    : `${totalCount} items`

  return (
    <ConditionalComponent condition={totalCount}>
      <div className="order-products-toolbar">
        <ConditionalComponent condition={toolbarNumber}>
          <p className="toolbar-amount">
            <span className="toolbar-number">{ toolbarNumber }</span>
          </p>
        </ConditionalComponent>
        <div className="pages">
          <ul className="items pages-items">
            <ConditionalComponent condition={params.page > 1}>
              <li 
                className="item pages-item-previous"
                onClick={() => setParams({...params, page: params.page - 1})}
              >
                <span className="action"><FontAwesomeIcon icon={faChevronLeft} /></span>
              </li>
            </ConditionalComponent>
              {pagesRender}
            <ConditionalComponent condition={params.page < totalPage}>
              <li
                className="item pages-item-next"
                onClick={() => setParams({...params, page: params.page + 1})}
              >
                <span className="action"><FontAwesomeIcon icon={faChevronRight} /></span>
              </li>
            </ConditionalComponent>
          </ul>
        </div>
        <div className="limiter">
          <strong className="limiter-label">Show</strong>
          <div className="wrap-select">
            <select
              className="limiter-options"
              value={params.pageSize}
              onChange={e => setParams({ pageSize: e.target.value, page: 1 })}
            >
              {limitRender}
            </select>
            <span className="select-icon"><FontAwesomeIcon icon={faChevronDown} /></span>
          </div>
          <span className="limiter-text">per page</span>
        </div>
      </div>
    </ConditionalComponent>
  )
}

export default ShopPerPage
