import React from 'react'
import styled from 'styled-components'

import Icon from '../../components/Icon'

const Greeting = ({ user }) => (
  <Wrapper>
    <LeftWrapper>
      Hello, {user ? user.first_name : 'Study Buddy'}!
    </LeftWrapper>
    <RightWrapper>
      <StyledIcon name='add' />
    </RightWrapper>
  </Wrapper>
)

const Wrapper = styled.div`
  font-size: 18px;
  font-weight: 00;
  color: #e8eaf6;
  height: 20%;
`

const LeftWrapper = styled.div`
  float: left;
`

const RightWrapper = styled.div`
  float: right;
`

const StyledIcon = styled(Icon)`
  width: 30%
`

export default Greeting
