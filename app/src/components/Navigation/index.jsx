import React from 'react'
import styled from 'styled-components'

import NavigationItem from './NavigationItem'

const Navigation = ({ user, location, history }) => {
  const routes = [
    { icon: 'search', route: '/search' },
    { icon: 'account_circle', route: '/profile' },
    { icon: 'home', route: '/home' },
    { icon: 'settings', route: '/settings' },
    { icon: 'close', route: '/exit' },
  ]
  
  return (
    <Wrapper>{
      routes.map(({ icon, route }) => (
        <NavigationItem 
          key={route} 
          icon={icon} 
          route={route}
          active={location.pathname === route}
          onClick={() => history.push(route)} 
        />
      ))
    }</Wrapper>
  )
}

const Wrapper = styled.div`
  height: 80px;
  width: 100%;
  display: flex;
  align-self: flex-end;
  padding-left: 40px;
  padding-right: 40px;
  justify-content: space-between;
`

export default Navigation