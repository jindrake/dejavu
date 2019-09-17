import React from 'react'
import styled from 'styled-components'

const Greeting = ({ user }) => (
  <Wrapper>
    Hello, {user ? user.first_name : 'Study Buddy'}!
  </Wrapper>
)

const Wrapper = styled.div`
  font-size: 20px;
  font-weight: 700;
  color: #e8eaf6;
  text-align: left;
`

export default Greeting
