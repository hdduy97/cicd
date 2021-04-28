import React from 'react'
import ReactDOM from 'react-dom'
import { ApolloClient, InMemoryCache } from '@apollo/client'
import { Provider } from 'react-redux'
import configureStore from './configureStore'
import './index.css'
import App from './App'
import reportWebVitals from './reportWebVitals'
import { ApolloProvider } from '@apollo/client/react'

const store = configureStore()

const client = new ApolloClient({
  uri: process.env.REACT_APP_GRAPHQL,
  cache: new InMemoryCache()
})

ReactDOM.render(
  <React.StrictMode>
    <ApolloProvider client={client}>
      <Provider store={store}>
        <App />
      </Provider>
    </ApolloProvider>
  </React.StrictMode>,
  document.getElementById('root')
)

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals()
