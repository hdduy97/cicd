import { combineReducers } from 'redux'
import globalMessage from './reducers/globalMessage'
import token from './reducers/token'
import customer from './reducers/customer'

const rootReducer = combineReducers({
  globalMessage,
  token,
  customer
})

export default rootReducer