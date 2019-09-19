import React from 'react'
import styled from 'styled-components'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faDizzy } from '@fortawesome/free-regular-svg-icons'

const NotFound = () => {
  return (
    <StyledContainer>
      <IconContainer>
        4
        <FontAwesomeIcon icon={faDizzy} />
        4
      </IconContainer>
      <ErrorContainer>
        ERROR
      </ErrorContainer>
      <TextContainer>
        PAGE NOT FOUND
      </TextContainer>
      <CommentDiv>
      There are 4 reason why this http status code appears:
      </CommentDiv>
      <DetailsDiv>
        {` -Your page was deleted from the website.`}
      </DetailsDiv>
      <DetailsDiv>
        {`  -The user has typed the URL address incorrectly.`}
      </DetailsDiv>
      <DetailsDiv>
        {`  -Page was moved and the redirection was configured incorrectly.`}
      </DetailsDiv>
      <DetailsDiv>
        {`  -The server malfunctions (it happens very rarely).`}
      </DetailsDiv>
      {/* PAGE NOT FOUND! */}
    </StyledContainer>
  )
}

const StyledContainer = styled.div`
  height: 98vh;
  diplay: flex;
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

const ErrorContainer = styled.div`
  font-size: 5vh;
  color: red;
  font-weight: bold;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
`

const TextContainer = styled.div`
  font-size: 3vh;
  color: red;
  font-weight: bold;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  margin-bottom: 20px;
`

const CommentDiv = styled.div`
  font-size: 3vh;
  color: white;
  display: flex;
`
const DetailsDiv = styled.div`
  font-size: 2vh;
  color: white;
  display: flex;
`

export default NotFound
