const initialState = {
  isSuccess: true,
  text: ''
}

const globalMessage = (state = initialState, action) => {
  switch (action.type) {
    case 'CHANGE_GLOBAL_MESSAGE':
      return {
        isSuccess: action.payload.isSuccess,
        text: action.payload.text
      }
    default:
      return state
  }
}

export default globalMessage