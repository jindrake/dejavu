import React from 'react'
import styled from 'styled-components'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

const NavigationItem = ({ icon, onClick, active, name }) => (
  <Wrapper onClick={onClick} active={active}>
    <FontAwesomeIcon icon={icon} />
    <Name>
      {name}
    </Name>
  </Wrapper>
)

const Name = styled.div`
  font-size: 3vh;
  margin-left: 3vh;
`

const Wrapper = styled.div`
  color: #e8eaf6;
  font-size: 8vh;
  display: flex;
  opacity: ${({ active }) => (active ? 1 : 0.5)};
  align-items: center;
  transition: 200ms;
  z-index: 99999;
  padding: 10;
  height: 10vh;
  width: 100vh;
  margin: 10px;

`

export default NavigationItem
