import React from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { NavItem } from 'reactstrap'

const NavigationItem = ({ icon, onClick, active, name }) => (
  <NavItem
    className='mb-2 text-wrap'
    active={active}
    onClick={onClick} >
    <FontAwesomeIcon className='list-inline-item' icon={icon} size='xs' />
    <p className='list-inline-item dejavu-small-text'>{name}</p>
  </NavItem>
)

export default NavigationItem
