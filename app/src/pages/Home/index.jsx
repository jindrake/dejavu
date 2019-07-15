import React from 'react'
import styled from 'styled-components'
import { Subscription, compose } from 'react-apollo'

import withFirebase from '../../hocs/withFirebase'

import Greeting from './Greeting'
import Section from './Section'

import { FETCH_ALL_TOPIC } from './queries'

// TODO replace with query

const Home = ({ extraPropsFromHOC, user }) => {
  return (
    <Wrapper>
      <Greeting user={user} />

      <Subscription subscription={FETCH_ALL_TOPIC}>
        {({ data, error, loading }) => {
          if (error) return <div>Error fetching topics: {error.message}</div>
          if (loading) return <div>lodaing topics...</div>
          const allTopics = data.topic
          console.log(allTopics)
          return (
            <Section title='All Topics' topics={allTopics} />
          )
        }}
      </Subscription>
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

export default compose(withFirebase())(Home)
