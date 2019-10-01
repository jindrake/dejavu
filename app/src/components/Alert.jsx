import React from 'react'
import styled from 'styled-components'

export const Alert = ({ text, ...props }) => <Wrapper {...props}>{text}</Wrapper>

const TYPE_STYLE = {
  error: `
    background: linear-gradient(45deg, #C62828, #E53935);
  `
}

const Wrapper = styled.div`
  display: flex;
  margin-top: 10px;
  margin-bottom: 10px;
  align-items: center;
  color: #e8eaf6;
  padding-left: 12px;
  padding-right: 12px;
  padding-top: 9px;
  padding-bottom: 9px;
  border-radius: 6px;
  font-size: 12px;
  animation: Bounce cubic-bezier(0.445, 0.05, 0.55, 0.95) both 600ms;
  ${({ type }) => TYPE_STYLE[type]}
`

export default Alert
