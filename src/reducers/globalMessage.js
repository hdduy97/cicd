import { ADD_GLOBAL_MESSAGE, REMOVE_GLOBAL_MESSAGE } from './types'

const globalMessage = (state = [], action) => {
  switch (action.type) {
    case ADD_GLOBAL_MESSAGE:
      return [...state, action.payload]
    case REMOVE_GLOBAL_MESSAGE:
      return state.slice(1)
    default:
      return state
  }
}

export default globalMessage