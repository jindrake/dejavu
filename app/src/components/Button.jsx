import React from 'react'
import styled from 'styled-components'

const Button = ({ text, icon, onClick, type }) => (
  <Wrapper onClick={onClick} type={type}>{text}</Wrapper>
)

const TYPE_STYLE = {
  'primary': `
    background: linear-gradient(45deg, #7b1fa2, #d500f9);
  `
}

const Wrapper = styled.div`
  display: flex;
  background: linear-gradient(45deg, #212121, #424242);
  box-shadow: 0 4px 0 0 rgba(0, 0, 0, 0.2);
  align-items: center;
  color: #E8EAF6;
  padding-left: 12px;
  padding-right: 12px;
  border-radius: 6px;
  height: 36px;
  font-size: 12px;
  ${({ type }) => TYPE_STYLE[type]}
`

export default Button
