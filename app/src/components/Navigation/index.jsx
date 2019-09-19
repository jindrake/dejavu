import React, { useState } from 'react'
import styled from 'styled-components'
import { withRouter } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faDotCircle, faPlusSquare } from '@fortawesome/free-regular-svg-icons'
import { faTimes, faSearch, faUserCircle, faHome, faCog, faSignOutAlt, faSignInAlt, faUserPlus } from '@fortawesome/free-solid-svg-icons'

import NavigationItem from './NavigationItem'

const Navigation = ({ user, location, history }) => {
  const [active, setActive] = useState(false)
  let routes

  const userRoutes = [
    { icon: faSearch, route: '/search', name: 'search' },
    { icon: faPlusSquare, route: '/topic/create', name: 'create new topic' },
    { icon: faUserCircle, route: '/profile', name: 'profile' },
    { icon: faHome, route: '/', name: 'home' },
    { icon: faCog, route: '/settings', name: 'settings' },
    { icon: faSignOutAlt, route: '/exit', name: 'sign-out' }
  ]

  const noUserRoutes = [
    { icon: faSearch, route: '/search', name: 'search' },
    { icon: faPlusSquare, route: '/topic/create', name: 'create new topic' },
    { icon: faUserCircle, route: '/profile', name: 'profile' },
    { icon: faHome, route: '/', name: 'home' },
    { icon: faCog, route: '/settings', name: 'settings' },
    { icon: faSignInAlt, route: '/sign-in', name: 'sign-in' },
    { icon: faUserPlus, route: '/sign-up', name: 'sign-up' }
  ]

  routes = user ? userRoutes : noUserRoutes

  return (
    <div>
      {
        <StyledIcon icon={faDotCircle} onClick={() => setActive(true)} />
      }
      {
        active && (
          <IconsDiv>
            {/* <div className='bg-danger'> */}
            {routes.map(({ icon, route, name }) => (
              <NavigationItem
                key={route}
                icon={icon}
                route={route}
                name={name}
                active={location.pathname === route}
                onClick={() => history.push(route)}
              />
            ))}
            <NavigationItem
              icon={faTimes}
              onClick={() => setActive(false)}
              name='close'
            />
          </IconsDiv>
        )
      }
    </div>
  )
}

const IconsDiv = styled.div`
  height: 100vh;
  width: 100vw;
  position: fixed;
  top: 0;
  left: 0;
  align-items: center;
  background: rgba(0, 0, 0, 0.7);
  z-index: 999999;
  transition: transform .2s ease-out;
  color: white;
`

const StyledIcon = styled(FontAwesomeIcon)`
  font-size: 9vh;
  color: #e8eaf6;
  bottom: 0;
  right: 0;
  margin-right: 10px;
  margin-bottom: 10px;
  position: fixed;
  transition: transform 300ms ease-in-out;
  z-index: 1000;
  box-shadow: 5px 5px 5px #240a2b;
  border-radius: 40px;
  background: linear-gradient(#FFA726, #FF9800);
`
export default withRouter(Navigation)
