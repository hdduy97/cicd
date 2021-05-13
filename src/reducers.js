import { combineReducers } from 'redux'
import globalMessage from './reducers/globalMessage'
import token from './reducers/token'
import customer from './reducers/customer'
import loading from './reducers/loading'

const rootReducer = combineReducers({
  globalMessage,
  token,
  customer,
  loading
})

export default rootReducer