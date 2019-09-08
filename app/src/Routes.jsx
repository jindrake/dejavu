import React, { useEffect } from 'react'
import { Route, Redirect, Switch } from 'react-router-dom'
import { withFirebase } from './hocs'
import gql from 'graphql-tag'
import { getObjectValue, useStateValue } from './libs'
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
import { FullPageLoader } from '../src/components'
import { useQuery } from '@apollo/react-hooks'
import compose from 'recompose/compose'

const FETCH_USER = gql`
  query fetchUser($email: String!) {
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

const Routes = ({ userEmail, firebase }) => {
  // const [user, setUser] = useState(null)
  const [{ user }, globalDispatch] = useStateValue()
  const { data, loading: fetchLoading, error: fetchError } = useQuery(FETCH_USER, {
    variables: {
      email: userEmail
    }
  })

  useEffect(() => {
    if (!user && getObjectValue(data, 'user[0]')) {
      console.warn('setting user')
      globalDispatch({
        user: getObjectValue(data, 'user[0]') || null
      })
    }
  }, [fetchLoading])

  if (fetchLoading) {
    return <FullPageLoader />
  }
  if (fetchError) {
    globalDispatch({
      networkError: fetchError.message
    })
    return null
  }

  console.log(data)

  return (
    <>
      <Route
        exact
        path={['/', '/search', '/settings', '/profile', '/topic/create', '/topic/:uri/questions']}
        render={() => <Navigation user={user} />}
      />
      <Switch>
        <Route exact path='/welcome' render={() => <Welcome user={user} />} />
        <Route
          exact
          path='/search'
          render={(routeProps) =>
            <Search {...routeProps} user={user} />
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
          path='/topic/:id/questions'
          render={(routeProps) =>
            !user ? (
              <Redirect to={`/sign-in?redirectUrl=${encodeURI(routeProps.location.pathname)}`} />
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
              <Redirect to={`/sign-in?redirectUrl=${encodeURI(routeProps.location.pathname)}`} />
            )
          }
        />

        <Route exact path='/' render={() => <Home />} />
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
              globalDispatch({
                user: null
              })
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
          path='/session/:sessionId'
          render={(routeProps) =>
            user ? (
              <AnswerQuestion {...routeProps} user={user} />
            ) : (
              <Redirect to={`/sign-in?redirectUrl=${encodeURI(routeProps.location.pathname)}`} />
            )
          }
        />
        <Route
          exact
          path='/result/:sessionId'
          render={(routeProps) =>
            user ? (
              <Result {...routeProps} user={user} />
            ) : (
              <Redirect to={`/sign-in?redirectUrl=${encodeURI(routeProps.location.pathname)}`} />
            )
          }
        />
      </Switch>
    </>
  )
}

export default compose(
  withFirebase()
)(Routes)
