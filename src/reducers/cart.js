import { TRIGGER_RELOAD, SET_CART, RESET_CART, SET_QUOTE_ID } from './types'

const initialState = {
  items: [],
  totals: {},
  quoteId: null,
  reloadCart: false
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
      return {...initialState, reloadCart: state.reloadCart}
    default:
      return state
  }
}

export default cart