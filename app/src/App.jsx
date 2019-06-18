import React, { useEffect, useState } from 'react'
import { Route, Switch, Redirect } from 'react-router-dom'
import { compose } from 'react-apollo'
import Home from './pages/Home'
import SignUp from './pages/SignUp'
import Login from './pages/Login'
import { withFirebase, withLayout, withData } from './hocs'
import gql from 'graphql-tag'
import { getObjectValue } from './libs'

const FETCH_USER = gql`
  query fetchUser($email: String) {
    user(where: { email: { _eq: $email } }) {
      email
      first_name
      last_name
      id
    }
  }
`

const App = ({ firebase, client }) => {
  const [user, setUser] = useState(null)

  useEffect(() => {
    const listener = firebase.auth.onAuthStateChanged((authUser) => {
      if (authUser) {
        client
          .query({
            query: FETCH_USER,
            variables: {
              email: authUser.email
            }
          })
          .then((result) => {
            const user = getObjectValue(result, 'data.user[0]')
            console.log('(App.jsx) user fetched:', user, result)
            setUser(user)
          })
      } else {
        setUser(null)
      }
    })
    return () => {
      listener()
    }
  }, [])

  console.log('Current user is:', user)

  return (
    <Switch>
      <Route exact path='/' render={(routeProps) => <Home {...routeProps} user={user} />} />

      <Route
        exact
        path='/signup'
        render={(routeProps) => (user ? <Redirect to='/' /> : <SignUp {...routeProps} />)}
      />
      <Route
        exact
        path='/login'
        render={(routeProps) => (user ? <Redirect to='/' /> : <Login {...routeProps} />)}
      />
    </Switch>
  )
}

export default compose(
  withData(),
  withLayout(),
  withFirebase()
)(App)
