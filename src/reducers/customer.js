const customer = (state = {}, action) => {
  switch(action.type) {
    case 'RESET_CUSTOMER':
      return {}
    case 'SET_CUSTOMER':
      return action.payload
    default:
      return state
  }
}

export default customer