import React, { useEffect, useState } from 'react'
import { Route, Redirect } from 'react-router-dom'
import { withFirebase, withLayout } from './hocs'
import gql from 'graphql-tag'
import { getObjectValue } from './libs'
import { ApolloProvider, Query, compose } from 'react-apollo'
import getInitializedApolloClient from './libs/getInitializedApolloClient'
import Home from './pages/Home'
import SignUp from './pages/SignUp'
import Login from './pages/Login'
import Topic from './pages/Topic'
import Navigation from './components/Navigation'

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

const App = ({ firebase }) => {
  const [authState, setAuthState] = useState({ loading: true })

  useEffect(() => {
    const listener = firebase.auth.onAuthStateChanged(async (user) => {
      console.log('<< AuthStateChange user >>:', user)
      if (user) {
        const token = await user.getIdToken()
        const idTokenResult = await user.getIdTokenResult()
        const hasuraClaim = idTokenResult.claims['https://hasura.io/jwt/claims']

        if (hasuraClaim) {
          setAuthState({ user, token })
        } else {
          // Check if refresh is required.
          const metadataRef = firebase.database().ref('metadata/' + user.uid + '/refreshTime')

          metadataRef.on('value', async () => {
            // Force refresh to pick up the latest custom claims changes.
            const token = await user.getIdToken(true)
            const idTokenResult = await user.getIdTokenResult(true)
            const hasuraClaim = await idTokenResult.claims['https://hasura.io/jwt/claims']
            // if there's no hasuraClaim but token exists, maintain authState({loading: true}) state
            if (hasuraClaim) {
              setAuthState({ user, token })
            }
          })
        }
      } else {
        setAuthState({ user: null })
      }
    })
    return () => {
      listener()
    }
  }, [firebase])

  if (authState.loading) {
    return <div>Loading symbol ...</div>
  }

  return (
    <ApolloProvider client={getInitializedApolloClient(authState.token)}>
      <Query query={FETCH_USER} variables={{ email: getObjectValue(authState, 'user.email') }}>
        {({ data, error, loading }) => {
          if (error) {
            console.error(error)
            return <div>Error: {JSON.stringify(error)}</div>
          }
          if (loading) return <div>Loading Symbol...</div>
          const user = getObjectValue(data, 'user[0]')
          return (
            <div>
              <Route path='/topic/:id' render={(routeProps) => <Topic {...routeProps} />} />
              <Route
                exact path={['/', '/signup', '/login']}
                render={(routeProps) => <Navigation {...routeProps} user={user} />}
              />
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
            </div>
          )
        }}
      </Query>
    </ApolloProvider>
  )
}

export default compose(
  withLayout(),
  withFirebase()
)(App)
