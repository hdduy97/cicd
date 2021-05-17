const logger = store => next => action => {
  console.group(action.type)
  if (action.type === 'ADD_GLOBAL_MESSAGE') {
    setTimeout(() => {
      store.dispatch({ type: 'REMOVE_GLOBAL_MESSAGE' })
    }, 3000);
  }
  console.info('dispatching', action)
  let result = next(action)
  console.log('next state', store.getState())
  console.groupEnd()
  return result
}

export default logger