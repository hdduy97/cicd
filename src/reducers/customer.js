const customer = (state = {}, action) => {
  switch(action.type) {
    case 'SET_CUSTOMER':
      return action.payload
    default:
      return state
  }
}

export default customer