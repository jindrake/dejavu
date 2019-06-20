import React from 'react'
import styled from 'styled-components'

const Greeting = ({ user }) => (
  <Wrapper>
    Hello, <Name>{user ? user.firstName : 'Study Buddy' }</Name>!
  </Wrapper>
)

const Name = styled.span`
  /* border-bottom: solid 2pt; */
  /* margin-bottom: -4px; */
  /* background: #FF8A65; */
  /* font-weight: 700; */
`

const Wrapper = styled.div`
  /* background: yellow; */
  /* display: flex; */
  height: 20%;
  font-size: 18px;
  font-weight: 00;
  color: #E8EAF6;
  height: 20%;
`

export default Greeting
