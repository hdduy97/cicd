import { combineReducers } from 'redux'
import globalMessage from './reducers/globalMessage'
import token from './reducers/token'
import customer from './reducers/customer'
import loading from './reducers/loading'
import cart from './reducers/cart'

const rootReducer = combineReducers({
  globalMessage,
  token,
  customer,
  loading,
  cart
})

export default rootReducer