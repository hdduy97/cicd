import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import axios from 'axios'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faShoppingCart } from '@fortawesome/free-solid-svg-icons'

import './header.scss'

const Header = () => {
  const [logo, setLogo] = useState({
    src: '',
    width: 0,
    height: 0,
    alt: null
  })

  const [search, setSearch] = useState('')

  const onSubmit = (e) => {
    e.preventDefault()

    console.log(search)
  }

  useEffect(() => {
    const fetchLogo = async() => {
      try {
        const { data } = await axios.get(process.env.REACT_APP_RESTURL + '/store/logo')

        setLogo(data)
      } catch (e) {

      }
    }

    fetchLogo()
  }, [])

  if (!logo.src) return null

  return (
    <div className="header content">
      <Link to="/" className="logo">
        <img 
          src={logo.src}
          width={logo.width > 0 ? logo.width : ''}
          height={logo.height > 0 ? logo.height : ''}
          alt={logo.alt > 0 ? logo.alt : ''}
        />
      </Link>
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
