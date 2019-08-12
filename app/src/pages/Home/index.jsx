import React, { useState, useEffect } from 'react'
import styled from 'styled-components'
import { compose, graphql } from 'react-apollo'

import withFirebase from '../../hocs/withFirebase'

import Greeting from './Greeting'
import Section from './Section'
import { useStateValue } from '../../libs'

import { FETCH_HOT_TOPICS, FETCH_RECENT_TOPICS } from './queries'
import { OverlayLoader } from '../../components'

// TODO replace with query

const Home = ({ fetchHotTopics, fetchRecentTopics, user }) => {
  const [hotTopics, setHotTopics] = useState([])
  const [recentTopics, setRecentTopics] = useState([])
  const [, globalDispatch] = useStateValue()

  useEffect(() => {
    handleFetchedTopics()
  }, [fetchHotTopics.loading, fetchRecentTopics.loading])

  const handleFetchedTopics = () => {
    if (fetchHotTopics.topic) {
      setHotTopics(fetchHotTopics.topic)
    }
    if (fetchRecentTopics.topic) {
      setRecentTopics(fetchHotTopics.topic)
    }
    if (fetchHotTopics.error) {
      globalDispatch({
        networkError: fetchHotTopics.error.message
      })
    }
    if (fetchRecentTopics.error) {
      globalDispatch({
        networkError: fetchRecentTopics.error.message
      })
    }
  }

  if (fetchHotTopics.loading || fetchRecentTopics.loading) {
    return <OverlayLoader />
  }

  return (
    <Wrapper>
      <Greeting user={user} />
      <Section title='Hot Topics' topics={hotTopics} user={user} />
      <Section title='Recent Topics' topics={recentTopics} user={user} />
    </Wrapper>
  )
}

const Wrapper = styled.div`
  position: absolute;
  display: flex;
  flex-direction: column;
  bottom: 80px;
  width: 100%;
  top: 0;
  padding: 40px;
  padding-bottom: 0;
`

export default compose(
  withFirebase(),
  graphql(FETCH_HOT_TOPICS, { name: 'fetchHotTopics', options: { fetchPolicy: 'no-cache' } }),
  graphql(FETCH_RECENT_TOPICS, { name: 'fetchRecentTopics', options: { fetchPolicy: 'no-cache' } })
)(Home)
