import React from 'react'
import styled from 'styled-components'
import withFirebase from '../../hocs/withFirebase'

import Greeting from './Greeting'
import Section from './Section'

import { compose } from 'react-apollo'

// TODO replace with query
const dummyHotTopics = [
  { author: 'Jess Lanchi', title: 'Dating a Med Student' },
  { author: 'Joanna Lucero Verrry Long Name Laaassst Name', title: 'How to be Human' },
  { author: 'Marlon Ynion', title: 'China 101' }
]
const dummyRecentTopics = [
  { author: 'Samson Review Center', title: 'Microbiology for Freshmen' },
  { author: 'Pymy Cainglet', title: 'Proving Trigonometric Lorem ipsum dolor sit amet, consectetur adipiscing elit nunc massa, suscipit sit amet metus sed, tempor fermentum erat' },
  { author: 'Marlon Ynion', title: 'Nursing Foundation' }
]

const Home = ({ extraPropsFromHOC, user }) => {
  return (
    <Wrapper>
      <Greeting user={user} />
      <Section title='Recent Topics' topics={dummyRecentTopics} />
      <Section title='Hot Topics' topics={dummyHotTopics} />
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
  withFirebase()
)(Home)
