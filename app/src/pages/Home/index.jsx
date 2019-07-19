import React from 'react'
import styled from 'styled-components'
import { Subscription, compose } from 'react-apollo'

import withFirebase from '../../hocs/withFirebase'

import Greeting from './Greeting'
import Section from './Section'

import { compose, Query } from 'react-apollo'
import gql from 'graphql-tag'

// TODO replace with query
const RETRIEVE_TOPICS = gql`
  query {
    topic {
      name
      description
    }
  }
`
// const dummyHotTopics = [
//   { author: 'Jess Lanchi', title: 'Dating a Med Student' },
//   { author: 'Joanna Lucero Verrry Long Name Laaassst Name', title: 'How to be Human' },
//   { author: 'Marlon Ynion', title: 'China 101' }
// ]
// const dummyRecentTopics = [
//   { author: 'Samson Review Center', title: 'Microbiology for Freshmen' },
//   {
//     author: 'Pymy Cainglet',
//     title:
//       'Proving Trigonometric Lorem ipsum dolor sit amet, consectetur adipiscing elit nunc massa, suscipit sit amet metus sed, tempor fermentum erat'
//   },
//   { author: 'Marlon Ynion', title: 'Nursing Foundation' }
// ]

const Home = ({ user }) => {
  return (
    <Wrapper>
      <Greeting user={user} />
      <Query query={RETRIEVE_TOPICS}>
        {({ data, loading, error }) => {
          if (loading) return <p>LOADING</p>
          if (error) return <p>ERROR</p>

          return <Section title='Recent Topics' data={data} />
        }}
      </Query>
      <Query query={RETRIEVE_TOPICS}>
        {({ data, loading, error }) => {
          if (loading) return <p>LOADING</p>
          if (error) return <p>ERROR</p>

          return <Section title='Hot Topics' data={data} />
        }}
      </Query>
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
