import React from 'react'
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
import EditProfile from './pages/Profile/EditProfile'
import NotFound from './pages/NotFound'
import Edit from './pages/Topic/Edit'
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
        id
        has_finished
      }
    }
  }
`

const Routes = ({ userEmail, firebase }) => {
  const [{ user }, globalDispatch] = useStateValue()
  const { data, loading: fetchLoading, error: fetchError } = useQuery(FETCH_USER, {
    skip: !userEmail,
    variables: {
      email: userEmail
    }
  })

  if (fetchLoading) {
    return <FullPageLoader />
  }
  if (fetchError) {
    console.error('error@routes:1')
    if (fetchError.message.includes('Could not verify JWT: JWTExpired')) {
      console.error('LSKJDFSKLDJFSLDKFJ')
      firebase.auth.currentUser.getIdToken()
    } else {
      globalDispatch({
        networkError: fetchError.message
      })
    }
    return null
  }

  if (!user && getObjectValue(data, 'user[0]')) {
    globalDispatch({
      user: getObjectValue(data, 'user[0]')
    })
  }

  if (fetchLoading || (!user && userEmail)) {
    return <FullPageLoader />
  }
  console.warn('Routes user is:', user)

  return (
    <>
      <Route
        exact
        path={['/', '/search', '/settings', '/profile', '/topic/create', '/topic/:uri/questions']}
        render={() => <Navigation user={user} />}
      />
      <Switch>
        <Route
          exact
          path='/welcome'
          render={() => {
            document.title = 'Welcome to Dejavu!'
            return <Welcome user={user} />
          }}
        />
        <Route
          exact
          path='/search'
          render={(routeProps) => {
            document.title = 'Search Topics'
            return <Search {...routeProps} user={user} />
          }}
        />
        <Route
          exact
          path='/topic/create'
          render={(routeProps) => {
            document.title = 'Create a Topic'
            return !user ? <Redirect to='/sign-in' /> : <Create {...routeProps} user={user} />
          }}
        />

        <Route
          exact
          path='/topic/:id/edit'
          render={(routeProps) => {
            document.title = 'Edit Topic'
            return !user ? <Redirect to='/sign-in' /> : <Edit {...routeProps} user={user} />
          }}
        />

        <Route
          exact
          path='/topic/:id/questions'
          render={(routeProps) => {
            document.title = 'Topic Questions'
            return !user ? (
              <Redirect to={`/sign-in?redirectUrl=${encodeURI(routeProps.location.pathname)}`} />
            ) : (
              <Questions {...routeProps} user={user} />
            )
          }}
        />
        <Route
          exact
          path='/topic/:id'
          render={(routeProps) => {
            document.title = 'View Topic'
            return user ? (
              <Topic {...routeProps} user={user} />
            ) : (
              <Redirect to={`/sign-in?redirectUrl=${encodeURI(routeProps.location.pathname)}`} />
            )
          }}
        />

        <Route
          exact
          path='/'
          render={(routeProps) => {
            document.title = 'Dejavu'
            return <Home {...routeProps} />
          }}
        />
        <Route
          exact
          path='/sign-up'
          render={(routeProps) => {
            document.title = 'Register to Dejavu'
            return user ? <Redirect to='/' /> : <SignUp {...routeProps} />
          }}
        />
        <Route
          exact
          path='/profile'
          render={() => {
            document.title = 'Profile'
            return user ? <Profile user={user} /> : <Redirect to='/sign-in' />
          }}
        />
        <Route
          exact
          path='/edit-profile'
          render={() => {
            document.title = 'Edit Profile'
            return user ? <EditProfile user={user} /> : <Redirect to='/sign-in' />
          }}
        />
        <Route
          exact
          path='/sign-in'
          render={(routeProps) => {
            document.title = 'Login to Dejavu'
            return user ? <Redirect to='/' /> : <SignIn {...routeProps} />
          }}
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
          render={(routeProps) => {
            document.title = "How's your Experience?"
            return user ? <Feedback {...routeProps} user={user} /> : <Redirect to='/' />
          }}
        />
        <Route
          exact
          path='/session/:sessionId'
          render={(routeProps) => {
            document.title = 'In Game!'
            return user ? (
              <AnswerQuestion {...routeProps} user={user} />
            ) : (
              <Redirect to={`/sign-in?redirectUrl=${encodeURI(routeProps.location.pathname)}`} />
            )
          }}
        />
        <Route
          exact
          path='/result/:sessionId'
          render={(routeProps) => {
            document.title = 'Results'
            return user ? (
              <Result {...routeProps} user={user} />
            ) : (
              <Redirect to={`/sign-in?redirectUrl=${encodeURI(routeProps.location.pathname)}`} />
            )
          }}
        />
        <Route
          path='*'
          render={(routeProps) => {
            document.title = 'Page not found'
            return <NotFound {...routeProps} />
          }}
        />
      </Switch>
    </>
  )
}

export default compose(withFirebase())(Routes)
