import React, { useEffect, useState } from 'react'
import { Route, Redirect, Switch, withRouter } from 'react-router-dom'
import { withFirebase, withLayout } from './hocs'
import gql from 'graphql-tag'
import { getObjectValue, useStateValue } from './libs'
import { ApolloProvider, Query, compose } from 'react-apollo'
import getInitializedApolloClient from './libs/getInitializedApolloClient'

import Home from './pages/Home'
import SignUp from './pages/SignUp'
import SignIn from './pages/SignIn'
import Topic from './pages/Topic'
import Create from './pages/Topic/Create'
import Navigation from './components/Navigation'
import Questions from './pages/Topic/Questions'
import Profile from './pages/Profile'
import Search from './pages/Search'
import Feedback from './pages/Feedback'
import Welcome from './pages/Welcome'
import AnswerQuestion from './pages/Topic/AnswerQuestion'
import Result from './pages/Topic/Result'
import { FullPageLoader, OverlayLoader, Notification } from '../src/components'
import { Alert } from 'reactstrap'

const FETCH_USER = gql`
  query fetchUser($email: String) {
    user(where: { email: { _eq: $email } }) {
      email
      first_name
      last_name
      id
      fields {
        field
      }
    }
  }
`

const App = ({ firebase, history, location: { search } }) => {
  const [authState, setAuthState] = useState({ loading: true })
  const [{ loading, networkError }, globalDispatch] = useStateValue()
  useEffect(() => {
    const listener = firebase.auth.onAuthStateChanged(async (user) => {
      console.log('<< AuthStateChange user >>:', user)
      if (user) {
        const token = await user.getIdToken()
        const idTokenResult = await user.getIdTokenResult()
        const hasuraClaim = idTokenResult.claims['https://hasura.io/jwt/claims']
        // TODO: remove after dev
        if (hasuraClaim) {
          if (!hasuraClaim['x-hasura-user-id'].includes('-')) {
            window.alert('OLD ACCOUNT, change dummy email until we change firebase console')
            firebase.doSignOut()
          }
          setAuthState({ user, token })
          if (search.startsWith('?redirectUrl=')) {
            history.push(decodeURI(search.substr(13)))
          }
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
              if (search.startsWith('?redirectUrl=')) {
                history.push(decodeURI(search.substr(13)))
              }
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
  }, [firebase, history, search])

  if (authState.loading) {
    return <FullPageLoader />
  }

  if (networkError) {
    setTimeout(() => {
      globalDispatch({
        networkError: null
      })
    }, 4000)
  }

  return (
    <ApolloProvider client={getInitializedApolloClient(authState.token)}>
      {loading && <OverlayLoader className='bg-transparent' />}
      {networkError && (
        <Notification>
          <Alert color='danger'>{networkError}</Alert>
        </Notification>
      )}
      <Query query={FETCH_USER} variables={{ email: getObjectValue(authState, 'user.email') }}>
        {({ data, error, loading }) => {
          if (error && authState.user) {
            if (JSON.stringify(error) === 'GraphQL error: Could not verify JWT: JWTExpired') {
              globalDispatch({
                networkError: 'Session expired. Please login again'
              })
            }
            return null
          }
          if (loading) return <OverlayLoader />
          const user = getObjectValue(data, 'user[0]') || null
          console.log('>>> User is:', user)
          if (!user && authState.user) {
            firebase.doSignOut()
            setAuthState({
              user: null,
              token: null
            })
          }
          return (
            <>
              <Route
                exact
                path={[
                  '/',
                  '/search',
                  '/settings',
                  '/profile',
                  '/topic/create',
                  '/topic/:uri/questions'
                ]}
                render={() => <Navigation user={user} />}
              />
              <Switch>
                <Route exact path='/welcome' render={() => <Welcome user={user} />} />
                <Route
                  exact
                  path='/search'
                  render={(routeProps) =>
                    !user ? <Redirect to='/sign-in' /> : <Search {...routeProps} user={user} />
                  }
                />
                <Route
                  exact
                  path='/topic/create'
                  render={(routeProps) =>
                    !user ? <Redirect to='/sign-in' /> : <Create {...routeProps} user={user} />
                  }
                />
                <Route
                  exact
                  path='/topic/:uri/questions'
                  render={(routeProps) =>
                    !user ? (
                      <Redirect
                        to={`/sign-in?redirectUrl=${encodeURI(routeProps.location.pathname)}`}
                      />
                    ) : (
                      <Questions {...routeProps} user={user} />
                    )
                  }
                />
                <Route
                  exact
                  path='/topic/:id'
                  render={(routeProps) =>
                    user ? (
                      <Topic {...routeProps} user={user} />
                    ) : (
                      <Redirect
                        to={`/sign-in?redirectUrl=${encodeURI(routeProps.location.pathname)}`}
                      />
                    )
                  }
                />

                <Route exact path='/' render={() => <Home user={user} />} />
                <Route
                  exact
                  path='/sign-up'
                  render={(routeProps) => (user ? <Redirect to='/' /> : <SignUp {...routeProps} />)}
                />
                <Route
                  exact
                  path='/profile'
                  render={() => (user ? <Profile user={user} /> : <Redirect to='/sign-in' />)}
                />
                <Route
                  exact
                  path='/sign-in'
                  render={(routeProps) => (user ? <Redirect to='/' /> : <SignIn {...routeProps} />)}
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

                <Route
                  exact
                  path='/feedback'
                  render={(routeProps) =>
                    user ? <Feedback {...routeProps} user={user} /> : <Redirect to='/' />
                  }
                />

                <Route
                  exact
                  path='/topic/:id/questions/:questionId/topicSession/:topicSessionId'
                  render={(routeProps) =>
                    user ? (
                      <AnswerQuestion {...routeProps} user={user} />
                    ) : (
                      <Redirect
                        to={`/sign-in?redirectUrl=${encodeURI(routeProps.location.pathname)}`}
                      />
                    )
                  }
                />

                <Route
                  exact
                  path='/result/:id/topicSession/:topicSessionId'
                  render={(routeProps) =>
                    user ? (
                      <Result {...routeProps} user={user} />
                    ) : (
                      <Redirect
                        to={`/sign-in?redirectUrl=${encodeURI(routeProps.location.pathname)}`}
                      />
                    )
                  }
                />
              </Switch>
            </>
          )
        }}
      </Query>
    </ApolloProvider>
  )
}

export default compose(
  withRouter,
  withLayout(),
  withFirebase()
)(App)
