import React, { useEffect, useState } from 'react'
import { Route, Redirect, Switch } from 'react-router-dom'
import { withFirebase, withLayout } from './hocs'
import gql from 'graphql-tag'
import { getObjectValue } from './libs'
import { ApolloProvider, Query, compose } from 'react-apollo'
import getInitializedApolloClient from './libs/getInitializedApolloClient'

import Home from './pages/Home'
import SignUp from './pages/SignUp'
import SignIn from './pages/SignIn'
import Topic from './pages/Topic'
import CreateTopic from './pages/Topic/CreateTopic'
import Navigation from './components/Navigation'
import AddQuestions from './pages/Topic/AddQuestions'

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
            console.log('<><><><> Appp hasura claim:', hasuraClaim)
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
          console.log('>>> User is:', user)
          return (
            <div>
              <Route
                exact
                path={['/', '/search', '/settings', '/profile']}
                render={() => <Navigation user={user} />}
              />
              <Switch>
                <Route
                  exact
                  path='/topic/create'
                  render={(routeProps) =>
                    !user ? <Redirect to='/sign-in' /> : <CreateTopic {...routeProps} user={user} />
                  }
                />
                <Route
                  exact
                  path='/topic/:uri/add-questions'
                  render={(routeProps) =>
                    user ? <Redirect to='/' /> : <AddQuestions {...routeProps} />
                  }
                />
                <Route exact path='/topic/:id' component={Topic} />

                <Route exact path='/' render={() => <Home user={user} />} />
                <Route
                  exact
                  path='/sign-up'
                  render={() => (user ? <Redirect to='/' /> : <SignUp />)}
                />
                <Route
                  exact
                  path='/profile'
                  render={() =>
                    user ? <div>{`${user.first_name}'s profile`}</div> : <Redirect to='/sign-in' />
                  }
                />
                <Route
                  exact
                  path='/sign-in'
                  render={() => (user ? <Redirect to='/' /> : <SignIn />)}
                />
                <Route
                  exact
                  path='/exit'
                  render={() => {
                    if (user) {
                      firebase.doSignOut()
                    }
                    return <Redirect to='/' />
                  }}
                />
              </Switch>
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
