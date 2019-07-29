import React from 'react'
import ReactDOM from 'react-dom'
import App from './App'
import Firebase, { FirebaseContext } from './libs/firebase'
import { BrowserRouter } from 'react-router-dom'
import { StateProvider } from './libs/state'
import './index.css'

const initialState = {
  user: null,
  redirectUrl: null,
  loading: false,
  networkError: null
}

const reducer = (state, payload) => {
  return { ...state, ...payload }
}

ReactDOM.render(
  <BrowserRouter>
    <FirebaseContext.Provider value={new Firebase()}>
      <StateProvider initialState={initialState} reducer={reducer}>
        <App />
      </StateProvider>
    </FirebaseContext.Provider>
  </BrowserRouter>,
  document.getElementById('root')
)

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
