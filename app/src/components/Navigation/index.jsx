import React, { useState } from 'react'
import { withRouter } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { Button, Navbar, Nav } from 'reactstrap'
// import Logo from '../../assets/itworks.png'
import CheeseburgerMenu from 'cheeseburger-menu'
import {
  faBars,
  faSearch,
  faUserCircle,
  faHome,
  faSignOutAlt,
  faSignInAlt,
  faUserPlus,
  faBullhorn
} from '@fortawesome/free-solid-svg-icons'

import NavigationItem from './NavigationItem'

const Navigation = ({ user, location, history }) => {
  const [collapsed, collapse] = useState(false)
  const [active, setActive] = useState(false)
  let routes

  const userRoutes = [
    { icon: faHome, route: '/', name: 'Home' },
    { icon: faSearch, route: '/search', name: 'Search' },
    { icon: faUserCircle, route: '/profile', name: 'Profile' },
    { icon: faBullhorn, route: '/feedback', name: 'Feedback' },
    { icon: faSignOutAlt, route: '/exit', name: 'Sign Out' }
  ]

  const noUserRoutes = [
    { icon: faHome, route: '/', name: 'Home' },
    { icon: faUserCircle, route: '/profile', name: 'Profile' },
    { icon: faSearch, route: '/search', name: 'Search' },
    { icon: faSignInAlt, route: '/sign-in', name: 'Sign In' },
    { icon: faUserPlus, route: '/sign-up', name: 'Sign Up' }
  ]

  routes = user ? userRoutes : noUserRoutes

  const openNav = () => {
    collapse(true)
  }

  const closeNav = () => {
    collapse(false)
  }

  return (
    <div>
      <Navbar className='faded' light expand='lg'>
        <Button className='navbar text-dark border-0 bg-transparent' onClick={() => openNav()}>
          <FontAwesomeIcon icon={faBars} size='lg' />
        </Button>
        <CheeseburgerMenu
          isOpen={collapsed}
          closeCallback={() => closeNav()}
          navbar
          width='42%'
          className='flex-column text-light'
          backgroundColor='#5eb2fb'
        >
          {/* <img src={Logo} class='justify-content-center text-center text-wrap img-fluid' alt='Dejavu' /> */}
          <div className='justify-content-center text-center text-wrap mt-4 mb-3'>
            <Button
              color='dark'
              className='border-0 rounded-0 bg-white text-dark'
              id='button'
              onClick={() => {
                history.push('/topic/create')
                closeNav()
                setActive(true)
              }}
            >
              Create Topic
            </Button>
          </div>
          <Nav navbar vertical className='justify-content-left m-4'>
            {routes.map((route) => (
              <NavigationItem
                active={active}
                icon={route.icon}
                name={route.name}
                onClick={() => {
                  history.push(route.route)
                  closeNav()
                  setActive(true)
                }}
              />
            ))}
          </Nav>
        </CheeseburgerMenu>
      </Navbar>
    </div>
  )
}

export default withRouter(Navigation)
