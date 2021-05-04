import Cookie from 'js-cookie'

const token = (state = '', action) => {
  switch(action.type) {
    case 'SET_TOKEN':
      Cookie.set('token', action.payload)
      return action.payload
    default:
      return state
  }
}

export default token