import React from 'react'
import styled from 'styled-components'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

const NavigationItem = ({ icon, onClick, active }) => (
  <Wrapper onClick={onClick} active={active}>
    <FontAwesomeIcon icon={icon} />
  </Wrapper>
)

const Wrapper = styled.div`
  color: #e8eaf6;
  font-size: 6vh;
  display: flex;
  opacity: ${({ active }) => (active ? 1 : 0.5)};
  justify-content: center;
  align-items: center;
  align-self: center;
  transition: 200ms;
  z-index: 99999;
  border: 3px solid white;
  padding: 10;
  height: 10vh;
  width: 10vh;

`

export default NavigationItem
