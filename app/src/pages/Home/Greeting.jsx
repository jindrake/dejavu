import React from 'react'
import styled from 'styled-components'
import { Button } from 'reactstrap'

import Icon from '../../components/Icon'

const Greeting = ({ user, history, topics }) => (
  <Wrapper>
    Hello, {user ? user.first_name : 'Study Buddy'}!
    <ButtonContainer>
      <CreateTopicButton
        id='button'
        onClick={
          () => history.push('/topic/create')
        }
      >
        <StyledIcon name='add' />Create  a Topic
      </CreateTopicButton>
    </ButtonContainer>
  </Wrapper>
)

const Wrapper = styled.div`
  font-size: 20px;
  font-weight: 700;
  color: #e8eaf6;
  text-align: left;
`

const ButtonContainer = styled.div`
  justify-content: left;
`

const CreateTopicButton = styled(Button)`
  background-color: rgb(119, 81, 175);
  font-size: 12px;
  border: none;
`

const StyledIcon = styled(Icon)`
  width: 30%
`

export default Greeting
