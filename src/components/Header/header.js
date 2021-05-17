import React, { useState } from 'react'
import { Link } from 'react-router-dom'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faShoppingCart } from '@fortawesome/free-solid-svg-icons'

import './header.scss'

const Header = ({ logo }) => {

  const [search, setSearch] = useState('')

  const onSubmit = (e) => {
    e.preventDefault()

    console.log(search)
  }

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
          <form onSubmit={onSubmit}>
            <input 
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search entire store here..."
            />
          </form>
        </div>
        <div className="minicart-wrapper">
          <span><FontAwesomeIcon icon={faShoppingCart} /></span>
        </div>
      </div>
    </div>
  )
}

export default Header
