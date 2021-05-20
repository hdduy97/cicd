import React, { useState, useEffect } from 'react'
import { useDispatch } from 'react-redux'
import axios from 'axios'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faChevronDown, faCheckSquare, faEdit } from '@fortawesome/free-solid-svg-icons'
import ConditionalComponent from '../../conditionalComponent'

import { ADD_GLOBAL_MESSAGE, SHOW_LOADING, HIDE_LOADING } from '../../../reducers/types'

const ShippingAddress = ({ countries, step, setStep, token, customer, setShippingMethods, setAddress }) => {
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

  const countriesOption = countries.map(country => (
    <option key={country.id} value={country.id}>{country.full_name_english}</option>
  ))

  const headers = {
    Authorization: `Bearer ${token}`
  }

  const dispatch = useDispatch()

  const regionSelected = regions.find(el => el.code === regionCode)
  const region = regionSelected ? {
      region: regionSelected.name,
      region_code: regionSelected.code,
      region_id: regionSelected.id
    } : {
      region: regionCode,
      region_code: regionCode,
      region_id: 0
    }

  const onSubmit = async (e) => {
    e.preventDefault()

    dispatch({ type: SHOW_LOADING })

    try { 
      const address = {
        ...region,
        countryId,
        street: [street],
        postcode,
        city,
        firstname,
        lastname,
        telephone,
        company,
        email: customer.email,
        same_as_billing: 1
      }

      const { data } = await axios.post('/carts/mine/estimate-shipping-methods', { address }, { headers })
      setShippingMethods(data.filter(el => el.available).sort((a,b) => a.amount - b.amount))
      setAddress(address)
      setStep(2)
    } catch(e) {
      dispatch({ type: ADD_GLOBAL_MESSAGE, payload: { isSuccess: false, message: e.response.data.message }})
    }

    dispatch({ type: HIDE_LOADING })
  }

  const regionsOption = regions.map(region => (
    <option key={region.id} value={region.code}>{region.name}</option>
  ))

  useEffect(() => {
    const country = countries.find(el => el.id === countryId) || {}
    const regions = country.available_regions || []
    if (regions.length > 0) setRegionCode(regions[0].code)
    else setRegionCode('')
  }, [countryId, countries])

  return (
    <div className="checkout-step">
      <div className="step-title">
        <span>Shipping Address</span>
        <ConditionalComponent condition={step > 1}>
          <span className="edit" onClick={() => setStep(1)}><FontAwesomeIcon icon={faEdit} /></span>
        </ConditionalComponent>
      </div>
      <ConditionalComponent condition={step === 1}>
        <form className="form-shipping-address" onSubmit={onSubmit}>
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
              <span className="select-icon">
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
              <span className="select-icon">
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
          <div className="form-actions">
            <button className="action primary">Next</button>
          </div>
        </form>
      </ConditionalComponent>
      <ConditionalComponent condition={step !== 1}>
        <div className="addresses">
          <div className="shipping-address-items">
            <div className="shipping-address-item selected-item">
              <div>{`${firstname} ${lastname}`}</div>
              <div>{street}</div>
              <div>{`${city}, ${region.region} ${postcode}`}</div>
              <div>{`${country.full_name_english}`}</div>
              <div>{`${telephone}`}</div>
              <FontAwesomeIcon icon={faCheckSquare} className="check-icon" />
            </div>
          </div>
        </div>
      </ConditionalComponent>
    </div>
  )
}

export default ShippingAddress
