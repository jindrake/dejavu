import React from 'react'
import styled from 'styled-components'
import withData from '../../hocs/withData'
import withFirebase from '../../hocs/withFirebase'

import Greeting from './Greeting'
import Section from './Section'

import { compose, Query } from 'react-apollo'
import gql from 'graphql-tag'

const test = gql`
  {
    enum_topic_tag {
      topic_tag
    }
  }
`

const Home = ({ extraPropsFromHOC, user }) => {
  return (
    <Wrapper>
      <Greeting user={user} />
      <Section title='Recent Topics' />
      <Section title='Hot Topics' />
      <Query query={test}>
        {(data, error, loading) => {
          if (error) console.error(error)
          if (loading) console.log('loading')
          console.log('data is:', data)
          return <div />
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

export default compose(
  withData(),
  withFirebase()
)(Home)
