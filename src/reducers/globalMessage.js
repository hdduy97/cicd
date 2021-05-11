import { CHANGE_GLOBAL_MESSAGE } from './types'

const initialState = {
  isSuccess: true,
  message: ''
}

const globalMessage = (state = initialState, action) => {
  switch (action.type) {
    case CHANGE_GLOBAL_MESSAGE:
      return {
        isSuccess: action.payload.isSuccess,
        message: action.payload.message
      }
    default:
      return state
  }
}

export default globalMessage