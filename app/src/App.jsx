import React, { useEffect, useState } from 'react'
import { withRouter } from 'react-router-dom'
import { withFirebase, withLayout } from './hocs'
import { getObjectValue, useStateValue } from './libs'
import { ApolloProvider } from '@apollo/react-hooks'
import compose from 'recompose/compose'
import getInitializedApolloClient from './libs/getInitializedApolloClient'
import Routes from './Routes'
import { FullPageLoader, OverlayLoader, Notification } from '../src/components'

const App = ({ firebase, history, location: { search } }) => {
  const [authState, setAuthState] = useState({ loading: true })
  const [{ loading, networkError, operationSuccess }, globalDispatch] = useStateValue()
  useEffect(() => {
    const listener = firebase.auth.onAuthStateChanged(async (user) => {
      if (user) {
        try {
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
              history.push(decodeURIComponent(search.substr(13)))
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
                  history.push(decodeURIComponent(search.substr(13)))
                }
              }
            })
          }
        } catch (error) {
          console.error('error@app1')
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
    if (networkError.includes('JWTExpired')) {
      firebase.auth.currentUser.getIdToken()
      window.location.reload()
    } else {
      setTimeout(() => {
        globalDispatch({
          networkError: null
        })
      }, 4000)
    }
  }

  if (operationSuccess) {
    setTimeout(() => {
      globalDispatch({
        operationSuccess: null
      })
    }, 4000)
  }

  return (
    <ApolloProvider client={getInitializedApolloClient(authState.token)}>
      {loading && <OverlayLoader className='bg-transparent' />}
      {networkError && (
        <Notification className='dejavu-small-text slideDown text-danger mb-2'>
          {networkError.split(':').pop().trim()}
        </Notification>
      )}
      {operationSuccess && (
        <Notification className='dejavu-small-text slideDown text-success mb-2'>
          {operationSuccess}
        </Notification>
      )}
      <Routes userEmail={getObjectValue(authState, 'user.email')} />
    </ApolloProvider>
  )
}

export default compose(
  withRouter,
  withLayout(),
  withFirebase()
)(App)
