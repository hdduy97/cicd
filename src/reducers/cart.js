import { TRIGGER_RELOAD, SET_CART, RESET_CART, SET_QUOTE_ID, SET_GUEST_CART_ID } from './types'
import Cookie from 'js-cookie'

const initialState = {
  items: [],
  totals: {},
  quoteId: null,
  reloadCart: false,
  guestCartId: null
}

const cart = (state = initialState, action) => {
  switch(action.type) {
    case TRIGGER_RELOAD:
      return {...state, reloadCart: !state.reloadCart}
    case SET_CART:
      return {...state, ...action.payload}
    case SET_QUOTE_ID:
      return {...state, quoteId: action.payload}
    case RESET_CART:
      Cookie.remove('guest-cart-id')
      return {...initialState, reloadCart: state.reloadCart}
    case SET_GUEST_CART_ID:
      Cookie.set('guest-cart-id', action.payload)
      return {...state, guestCartId: action.payload}
    default:
      return state
  }
}

export default cart