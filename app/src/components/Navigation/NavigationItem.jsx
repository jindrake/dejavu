import React from 'react'
import styled from 'styled-components'

import Icon from '../Icon'

const NavigationItem = ({ icon, onClick, active }) => (
  <Wrapper
    onClick={onClick}
    active={active}
  >
    <Icon name={icon} />
  </Wrapper>
)

const Wrapper = styled.div`
  height: 20px;
  color: #E8EAF6;
  width: 20px;
  font-size: 20px;
  display: flex;
  opacity: ${({ active }) => active ? 1 : 0.5};
  justify-content: center;
  align-self: center;
  border-radius: 20px;
  transition: 200ms;
`

export default NavigationItem
