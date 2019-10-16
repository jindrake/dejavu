import React, { useState } from 'react'
import styled from 'styled-components'
import { withRouter } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCompass } from '@fortawesome/free-regular-svg-icons'
import {
  faTimes,
  faSearch,
  faUserCircle,
  faHome,
  faSignOutAlt,
  faSignInAlt,
  faUserPlus,
  faEdit,
  faBullhorn
} from '@fortawesome/free-solid-svg-icons'

import NavigationItem from './NavigationItem'

const Navigation = ({ user, location, history }) => {
  const [active, setActive] = useState(false)
  let routes

  const userRoutes = [
    { icon: faSearch, route: '/search', name: 'Search' },
    { icon: faHome, route: '/', name: 'Home' },
    { icon: faEdit, route: '/topic/create', name: 'Create' },
    { icon: faUserCircle, route: '/profile', name: 'Profile' },
    { icon: faSignOutAlt, route: '/exit', name: 'Sign Out' },
    { icon: faBullhorn, route: '/feedback', name: 'Feedback' }
  ]

  const noUserRoutes = [
    { icon: faSearch, route: '/search', name: 'Search' },
    { icon: faHome, route: '/', name: 'Home' },
    { icon: faEdit, route: '/topic/create', name: 'Create' },
    { icon: faUserCircle, route: '/profile', name: 'Profile' },
    { icon: faSignInAlt, route: '/sign-in', name: 'Sign In' },
    { icon: faUserPlus, route: '/sign-up', name: 'Sign Up' }
  ]

  routes = user ? userRoutes : noUserRoutes

  return (
    <div>
      {<StyledIcon icon={faCompass} onClick={() => setActive(true)} />}
      {active && (
        <IconsDiv>
          {/* <div className='bg-danger'> */}
          <IconContainer>
            {routes.map(({ icon, route, name }) => (
              <NavigationItem
                key={route}
                icon={icon}
                route={route}
                name={name}
                active={location.pathname === route}
                onClick={() => {
                  setActive(false)
                  history.push(route)
                }}
              />
            ))}
            <NavigationItem icon={faTimes} onClick={() => setActive(false)} name='Close' />
          </IconContainer>
        </IconsDiv>
      )}
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
  transition: transform 0.2s ease-out;
  color: white;
  font-size: 4vh;
`

const StyledIcon = styled(FontAwesomeIcon)`
  font-size: 9vh;
  width: 1em;
  height: 1em;
  bottom: 0;
  right: 0;
  margin-right: 10px;
  margin-bottom: 10px;
  position: fixed;
  transition: transform 300ms ease-in-out;
  z-index: 1000;
  box-shadow: 5px 5px 5px #240a2b;
  border-radius: 40px;
  background-color: #5eb2fb;
  color: white;
  /* background: linear-gradient(#ffa726, #ff9800); */
`

const IconContainer = styled.div`
  text-align: right;
  right: 0.25em;
  bottom: 3em;
  position: absolute;
`

export default withRouter(Navigation)
