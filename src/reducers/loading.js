import { SHOW_LOADING, HIDE_LOADING } from './types'

const loading = (state = true, action) => {
  switch(action.type) {
    case SHOW_LOADING:
      return true
    case HIDE_LOADING:
      return false
    default:
      return state;
  }
}

export default loading