import React from 'react'
import styled from 'styled-components'

export const Button = ({ text, ...props }) => <Wrapper {...props}>{text}</Wrapper>

const TYPE_STYLE = {
  primary: `
    background: linear-gradient(45deg, #7b1fa2, #d500f9);
  `
}

const Wrapper = styled.div`
  display: flex;
  background: linear-gradient(45deg, #212121, #424242);
  box-shadow: 0 4px 0 0 rgba(0, 0, 0, 0.2);
  align-items: center;
  color: #e8eaf6;
  padding: 2vh;
  padding-left: 3vh;
  padding-right: 3vh;
  /* padding: 3vh; */
  border-radius: 1vh;
  height: 36px;
  /* font-size: 12px; */
  font-size: 2vh;
  white-space: nowrap;
  ${({ type }) => TYPE_STYLE[type]}
`
