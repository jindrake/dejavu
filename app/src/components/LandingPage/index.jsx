import React from 'react'
import NavigationLandingPage from './NavigationLandingPage'
import Footer from './Footer'
import SignupScreen from '../../assets/Group.png'

const MainDetails = 'Lets be study buddies! Join me now.'
const SubDetails = 'Listen look listen and learn!'

const LandingPage = () => (
  <div>
    <NavigationLandingPage />
    <div style={{ marginLeft: '140px', marginRight: '140px', display: 'flex', flexDirection: 'row', justifyContent: 'flex-end' }}>
      <div style={{ display: 'flex', flex: 1, flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
        <div style={{ fontSize: '4vh', fontWeight: 'bold', color: 'white' }}>
          {MainDetails}
        </div>
        <div style={{ fontSize: '4vh', fontWeight: 'bold', color: 'white' }}>
          {SubDetails}
        </div>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column' }}>
        <div>
          <img src={SignupScreen} alt='Logo' style={{ width: '18vw', height: '75vh' }} />
        </div>
        <div
          onClick={() => console.log('click play now')}
          style={{ cursor: 'pointer', textDecoration: 'underline', alignSelf: 'center', fontSize: '3vh', fontWeight: 'bold', color: 'white' }}
        >
          Play now!
        </div>
      </div>
    </div>
    <Footer />
  </div>
)

export default LandingPage
