import React, { useState, useEffect } from 'react'
import styled from 'styled-components'
import { compose, graphql } from 'react-apollo'

import withFirebase from '../../hocs/withFirebase'

import Greeting from './Greeting'
import Section from './Section'

import { FETCH_ALL_TOPIC } from './queries'

// TODO replace with query

const Home = ({ fetchAllTopic, user }) => {
  const [topics, setTopics] = useState([])
  
  useEffect(() => {
    console.log('component mounted!')
    const result = fetchAllTopic.topic
    if (result) {
      setTopics(result)
    }
    if (fetchAllTopic.error) {
      console.log(fetchAllTopic.error)
    }
  }, [fetchAllTopic.error, fetchAllTopic.topic, fetchAllTopic.loading])

  return (
    <Wrapper>
      <Greeting user={user} />
      <Section title='All Topics' topics={topics} />
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
  graphql(FETCH_ALL_TOPIC, { name: 'fetchAllTopic',  options: { fetchPolicy: 'no' } }),
)(Home)
