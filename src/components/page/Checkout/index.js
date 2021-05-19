import React, { useState, useEffect } from 'react'
import { useSelector } from 'react-redux'
import axios from 'axios'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faChevronDown } from '@fortawesome/free-solid-svg-icons'
import ConditionalComponent from '../../conditionalComponent'
import './index.scss'
const Index = () => {
  const { items, totals } = useSelector(state => state.cart)
  const [countries, setCountries] = useState([])
  const [firstname, setFirstname] = useState('')
  const [lastname, setLastname] = useState('')
  const [company, setCompany] = useState('')
  const [street, setStreet] = useState('')
  const [city, setCity] = useState('')
  const [countryId, setCountryId] = useState('US')
  const [telephone, setTelephone] = useState('')
  const [postcode, setPostcode] = useState('')
  const [regionCode, setRegionCode] = useState('')
  const country = countries.find(el => el.id === countryId) || {}
  const regions = country.available_regions || []

  const restUrl =  process.env.REACT_APP_RESTURL

  const countriesOption = countries.map(country => (
    <option key={country.id} value={country.id}>{country.full_name_english}</option>
  ))

  const regionsOption = regions.map(region => (
    <option key={region.id} value={region.code}>{region.name}</option>
  ))

  useEffect(() => {
    const fetchCountries = async () => {
      try {
        const { data } = await axios.get(restUrl + '/directory/countries')

        setCountries(data.filter(el => el.full_name_english).sort((a,b) => a.full_name_english > b.full_name_english ? 1 : -1))
      } catch(e) {
  
      }
    }

    fetchCountries()
  }, [restUrl])

  useEffect(() => {
    const country = countries.find(el => el.id === countryId) || {}
    const regions = country.available_regions || []
    if (regions.length > 0) setRegionCode(regions[0].code)
    else setRegionCode('')
  }, [countryId, countries])

  const itemsRender = items.map(item => {
    return (
      <li key={item.sku} className="cart-item">
        <span className="product-image-container" style={{ width: '75px' }}>
          <span className="product-image-wrapper">
            <img 
              className="product-image-photo"
              src={`${process.env.REACT_APP_PRODUCT_IMAGE}/${item.extension_attributes.thumbnail}`}
              alt={item.name} 
            />
          </span>
        </span>
        <div className="product-item-details">
          <div className="product-item-name">{item.name}</div>
          <div className="product-item-modify">
            <div className="product-item-qty">
              <label>Qty: {item.qty}</label>
            </div>
          </div>
          <div className="product-item-pricing"><strong>${item.price.toFixed(2)}</strong></div>
        </div>
      </li>
    )
  })

  return (
    <div className="checkout">
      <div className="checkout-block">
        <div className="checkout-step">
          <div className="step-title">Shipping Address</div>
          <form className="form-shipping-address">
            <div className="form-field">
              <label>First Name</label>
              <div className="control">
                <input type="text" value={firstname} onChange={e => setFirstname(e.target.value)} />
              </div>
            </div>
            <div className="form-field">
              <label>Last Name</label>
              <div className="control">
                <input type="text" value={lastname} onChange={e => setLastname(e.target.value)} />
              </div>
            </div>
            <div className="form-field">
              <label>Company</label>
              <div className="control">
                <input type="text" value={company} onChange={e => setCompany(e.target.value)} />
              </div>
            </div>
            <div className="form-field">
              <label>Street Address</label>
              <div className="control">
                <input type="text" value={street} onChange={e => setStreet(e.target.value)} />
              </div>
            </div>
            <div className="form-field">
              <label>City</label>
              <div className="control">
                <input type="text" value={city} onChange={e => setCity(e.target.value)} />
              </div>
            </div>
            <div className="form-field">
              <label>State/Province</label>
              <div className="control">
              <ConditionalComponent condition={regions.length > 0}>
                <select value={regionCode} onChange={e => setRegionCode(e.target.value)}>
                  {regionsOption}
                </select>
                <span class="select-icon">
                  <FontAwesomeIcon icon={faChevronDown} />
                </span>
              </ConditionalComponent>
              <ConditionalComponent condition={regions.length === 0}>
                <input type="text" value={regionCode} onChange={e => setRegionCode(e.target.value)} />
              </ConditionalComponent>
              </div>
            </div>
            <div className="form-field">
              <label>Zip/Postal Code</label>
              <div className="control">
                <input type="text" value={postcode} onChange={e => setPostcode(e.target.value)} />
              </div>
            </div>
            <div className="form-field">
              <label>Country</label>
              <div className="control">
                <select value={countryId} onChange={e => setCountryId(e.target.value)}>
                  {countriesOption}
                </select>
                <span class="select-icon">
                  <FontAwesomeIcon icon={faChevronDown} />
                </span>
              </div>
            </div>
            <div className="form-field">
              <label>Phone Number</label>
              <div className="control">
                <input type="text" value={telephone} onChange={e => setTelephone(e.target.value)} />
              </div>
            </div>
          </form>
        </div>
      </div>
      <div className="order-summary">
        <span className="title">Order Summary</span>
        <div className="items-in-cart">
          <span className="title">{`${items.length} Items in Cart`}</span>
          <div className="minicart-items">
            <div className="minicart-items-wrapper">
              <ol className="minicart-items">
                {itemsRender}
              </ol>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Index
