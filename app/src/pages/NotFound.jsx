import React from 'react'
import styled from 'styled-components'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faDizzy } from '@fortawesome/free-regular-svg-icons'
import { Button } from '../components/Button'

const NotFound = ({ history }) => {
  return (
    <StyledContainer>
      <IconContainer>
        4
        <FontAwesomeIcon icon={faDizzy} />
        4
      </IconContainer>
      <TextContainer>
        PAGE NOT FOUND
      </TextContainer>
      <ButtonContainer>
        <Button text={'Go Home'} type='warning' onClick={() => {
          history.push('/')
        }} />
      </ButtonContainer>
    </StyledContainer>
  )
}

const StyledContainer = styled.div`
  height: 98vh;
  diplay: flex;
`

const ButtonContainer = styled.div`
  position: absolute;
  bottom: 1vh;
`

const IconContainer = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  font-size: 18vh;
  color: #e8eaf6;
  font-weight: bold;
`

const TextContainer = styled.div`
  font-size: 3vh;
  color: linear-gradient(#FFA726, #FF9800);
  font-weight: bold;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  margin-bottom: 20px;
`

export default NotFound
