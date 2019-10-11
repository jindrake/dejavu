import React from 'react'
import styled from 'styled-components'

export const Button = ({ text, ...props }) => <Wrapper {...props}>{text}</Wrapper>

const TYPE_STYLE = {
  primary: `
  background: linear-gradient(45deg, #198dd3, #0792d3, #0096d2, #009bd1, #009fcf, #00a2cd, #00a6cb, #00a9c9, #00acc6, #00afc2, #00b2bd, #00b5b8);
  `,
  warning: `
    background: linear-gradient(45deg, #b22222, #bd2426, #c8252a, #d3272f, #de2833, #e43339, #eb3d40, #f14646, #f45751, #f6655b, #f87367, #fa8072);
  `,
  success: `
    background: linear-gradient(45deg, #015249, #05584d, #0b5e50, #116553, #186b56, #1e7159, #24775b, #2a7d5d, #32845f, #398a61, #429163, #4a9764);
  `,
  action: `
    background: linear-gradient(45deg, #003152, #00395a, #004062, #004869, #005071, #005777, #005f7d, #006682, #006e87, #00778b, #007f8e, #008790);
  `
}

const Wrapper = styled.div`
  display: flex;
  background: linear-gradient(45deg, #212121, #424242);
  box-shadow: 0 4px 0 0 rgba(0, 0, 0, 0.2);
  align-items: center;
  color: #e8eaf6;
  padding: 2vh;
  /* padding-left: 3vh;
  padding-right: 3vh; */
  /* padding: 3vh; */
  border-radius: 1vh;
  height: 36px;
  /* font-size: 12px; */
  font-size: 2vh;
  white-space: nowrap;
  ${({ type }) => TYPE_STYLE[type]};
  /* justify-content: ${({ center }) => center ? 'center' : 'start'}; */
  justify-content: ${props => props.center ? 'center' : ''};
  cursor: pointer;
  font-weight: 500;
`
