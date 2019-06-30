import React from 'react'
import styled from 'styled-components'

const Alert = ({ text, ...props }) => <Wrapper {...props}>{text}</Wrapper>

const TYPE_STYLE = {
  error: `
    background: linear-gradient(45deg, #C62828, #E53935);
  `
}

const Wrapper = styled.div`
  display: flex;
  margin-top: 10px;
  align-items: center;
  color: #e8eaf6;
  padding-left: 12px;
  padding-right: 12px;
  padding-top: 9px;
  padding-bottom: 9px;
  border-radius: 6px;
  font-size: 12px;
  ${({ type }) => TYPE_STYLE[type]}
`

export default Alert
