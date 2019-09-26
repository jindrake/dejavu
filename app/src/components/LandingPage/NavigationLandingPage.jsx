import React from 'react'
import Logo from '../../assets/itworks-no-bckgrnd.png'
import styled from 'styled-components'
import { withRouter } from 'react-router-dom'

const NavigationLandingPage = ({ history }) => (
  <Container>
    <div>
      <StyledText onClick={() => history.push('/landing-page/about-dejavu')}>
          About Dejavu
      </StyledText>
    </div>
    <div>
      <StyledText>
          How to use
      </StyledText>
    </div>
    <div>
      <LogoContainer onClick={() => history.push('/landing-page/')}>
        <img src={Logo} alt='Logo' style={{ width: '100px', height: '100px' }} />
      </LogoContainer>
    </div>
    <div>
      <StyledText>
          Developers
      </StyledText>
    </div>
    <div>
      <StyledText>
          Contact us
      </StyledText>
    </div>

  </Container>
)

const Container = styled.div`
  display: flex;
  justify-content: space-evenly;
  align-items: center;
`

const LogoContainer = styled.div`
  cursor: pointer;
`

const StyledText = styled.div`
  color: white;
  font-size: 2.5vh;
  cursor: pointer;
  font-weight: bold;
`

export default withRouter(NavigationLandingPage)
