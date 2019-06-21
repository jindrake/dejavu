import React from 'react'
import styled from 'styled-components'

const Greeting = ({ user }) => (
  <Wrapper>
    <div>Hello, {user ? user.first_name : 'Study Buddy' }!</div>
    <Notifications>This is where your notifications go.</Notifications>
  </Wrapper>
)

const Notifications = styled.div`
  font-size: 12px;
  opacity: 0.8;
`

const Wrapper = styled.div`
  height: 30%;
  font-size: 18px;
  font-weight: 00;
  color: #E8EAF6;
  height: 20%;
`

export default Greeting
