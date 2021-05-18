import { TRIGGER_RELOAD } from './types'

const reloadCart = (state = false, action) => {
  switch(action.type) {
    case TRIGGER_RELOAD:
      return !state
    default:
      return state
  }
}

export default reloadCart