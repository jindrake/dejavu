import styled from 'styled-components'
import React from 'react'

const StyledText = styled.span`
  color: deeppink;
  font-size: 10px;
  padding: 5px;
`

const ErrorText = ({ text }) => {
  return text ? <StyledText>{text}</StyledText> : null
}

export default ErrorText
