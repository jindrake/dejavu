import React, { useState } from 'react'
import styled from 'styled-components'
import { withRouter } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faDotCircle } from '@fortawesome/free-regular-svg-icons'
import { faTimes, faSearch, faUserCircle, faHome, faCog } from '@fortawesome/free-solid-svg-icons'

import NavigationItem from './NavigationItem'

const Navigation = ({ user, location, history }) => {
  const [active, setActive] = useState(false)

  const routes = [
    { icon: faSearch, route: '/search', name: 'search' },
    { icon: faUserCircle, route: '/profile', name: 'profile' },
    { icon: faHome, route: '/', name: 'home' },
    { icon: faCog, route: '/settings', name: 'settings' }
  ]

  return (
    <div>
      {
        <StyledIcon icon={faDotCircle} onClick={() => setActive(true)} />
      }
      {
        active && (
          <IconsDiv>
            {routes.map(({ icon, route }) => (
              <NavigationItem
                key={route}
                icon={icon}
                route={route}
                name={route.name}
                active={location.pathname === route}
                onClick={() => history.push(route)}
              />
            ))}
            <CloseIcon onClick={() => setActive(false)} icon={faTimes}>close</CloseIcon>
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
  display: flex;
  justify-content: space-evenly;
  align-items: center;
  z-index: 10000;
  background: rgba(0, 0, 0, 0.7);
  z-index: 999999;
  transition: transform .2s ease-out;
`

const CloseIcon = styled(FontAwesomeIcon)`
  color: #e8eaf6;
  top: 0;
  left: 0;
  position: absolute;
  font-size: 6vh;
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
`
export default withRouter(Navigation)
