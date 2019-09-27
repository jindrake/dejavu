import React from 'react'
import styled from 'styled-components'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

const NavigationItem = ({ icon, onClick, active, name }) => (
  <Wrapper onClick={onClick} active={active}>
    <FontAwesomeIcon icon={icon} style={{ width: '1em' }} />
    <Name>
      {name}
    </Name>
  </Wrapper>
)

const Name = styled.div`
  font-size: 3vh;
  margin-left: 3vh;
  right: .25em;
`

const Wrapper = styled.div`
  color: #e8eaf6;
  font-size: 4vh;
  display: flex;
  opacity: ${({ active }) => (active ? 1 : 0.5)};
  align-items: center;
  transition: 200ms;
  z-index: 99999;
  padding: 10;
  height: 5vh;
  margin: 10px;
`

export default NavigationItem
