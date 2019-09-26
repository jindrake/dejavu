import React from 'react'
import { withRouter } from 'react-router-dom'
import styled from 'styled-components'
import Logo from '../../assets/itworks-no-bckgrnd.png'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faGoogle, faFacebook } from '@fortawesome/free-brands-svg-icons'

const Footer = ({ history }) => (
  <Container>
    <div style={{ color: 'white' }}>
      <h2 style={{ fontSize: '3vh' }}>The Team</h2>
      <h3 style={{ fontSize: '1.5vh' }}>ITWorks</h3>
      <h3 style={{ fontSize: '1.5vh' }}>Our Philosophy</h3>
      <h3 style={{ fontSize: '1.5vh' }}>Careers</h3>
    </div>
    <div style={{ color: 'white' }}>
      <h2 style={{ fontSize: '3vh' }}>Dejavu</h2>
      <h3 style={{ fontSize: '1.5vh' }}>Insparation</h3>
      <h3 style={{ fontSize: '1.5vh' }}>Motivation</h3>
      <h3 style={{ fontSize: '1.5vh' }}>Goals</h3>
    </div>
    <div style={{ color: 'white' }}>
      <h2 style={{ fontSize: '3vh' }}>Contacts</h2>
      <div style={{ display: 'flex' }}>
        <StyledIcon icon={faGoogle} />
        <h3 style={{ marginLeft: '10px', fontSize: '1.5vh' }}>ItWorks@gmail.com</h3>
      </div>
      <div style={{ display: 'flex' }}>
        <StyledIcon icon={faFacebook} />
        <h3 style={{ marginLeft: '10px', fontSize: '1.5vh' }}>ItWorks@fb.com</h3>
      </div>
    </div>
    <div>
      <LogoContainer onClick={() => history.push('/landing-page/')}>
        <img src={Logo} alt='Logo' style={{ width: '100px', height: '100px' }} />
      </LogoContainer>
    </div>
  </Container>
)

// const Container = styled.div`
//   ${'' /* position: fixed,
//   bottom: 0,
//   left: 0,
//   right: 0, */}
//   border: 2px solid red,
// `

const LogoContainer = styled.div`
  cursor: pointer;
`

const Container = styled.div`
  display: flex;
  justify-content: space-evenly;
  align-items: flex-start;
  padding-top: 5vh;
  align-self: flex-start;
  border-top: 5px solid white;
  height: 20vh;
  margin-top: 150px;
  margin-bottom: 20px;
`

const StyledIcon = styled(FontAwesomeIcon)`
  font-size: 2vh;
`

export default withRouter(Footer)
