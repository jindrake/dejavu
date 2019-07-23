import React, { useState, useEffect } from 'react'
import styled from 'styled-components'
import { compose, graphql } from 'react-apollo'

import withFirebase from '../../hocs/withFirebase'

import Greeting from './Greeting'
import Section from './Section'

import { FETCH_HOT_TOPIC, FETCH_RECENT_TOPIC } from './queries'

// TODO replace with query

const Home = ({ fetchHotTopic, fetchRecentTopic, user }) => {
  const [hotTopics, setHotTopics] = useState([])
  const [recentTopics, setRecentTopics] = useState([])
  useEffect(() => {
    const allHotTopics = fetchHotTopic.topic
    const allRecentTopics = fetchRecentTopic.topic

    if (allHotTopics || allRecentTopics) {
      setHotTopics(allHotTopics)
      setRecentTopics(allRecentTopics)
    }
    if (fetchHotTopic.error || fetchRecentTopic.error) {
      console.log(fetchHotTopic.error)
      console.log(fetchRecentTopic.error)
    }
  }, [
    fetchHotTopic, fetchRecentTopic,
    fetchHotTopic.error, fetchHotTopic.topic, fetchHotTopic.loading,
    fetchRecentTopic.error, fetchRecentTopic.topic, fetchRecentTopic.loading
  ])

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
  graphql(FETCH_HOT_TOPIC, { name: 'fetchHotTopic', options: { fetchPolicy: 'no-cache' } }),
  graphql(FETCH_RECENT_TOPIC, { name: 'fetchRecentTopic', options: { fetchPolicy: 'no-cache' } })
)(Home)
