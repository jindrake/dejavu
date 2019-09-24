import React from 'react'
import { withRouter } from 'react-router-dom'
import compose from 'recompose/compose'

const Settings = ({ history, user }) => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column' }}>
      <div style={{ alignSelf: 'center', fontWeight: '500', fontSize: '4vh', color: 'white' }}>Settings</div>
      <div style={{ fontWeight: '500', fontSize: '3vh', color: 'white' }}>
        Personal Information
        <div
          style={{
            border: '2px solid white',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            borderRadius: '10px',
            padding: '5px',
            backgroundColor: 'white',
            fontWeight: '500',
            color: 'black',
            fontSize: '2.5vh'
          }}
          onClick={() => history.push('/edit-profile')}
        >
          Edit Profile
        </div>
      </div>
      <div style={{ fontWeight: '500', fontSize: '3vh', color: 'white' }}>
        Topic Management
        <div
          style={{
            border: '2px solid white',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            borderRadius: '10px',
            padding: '5px',
            backgroundColor: 'white',
            fontWeight: '500',
            color: 'black',
            fontSize: '2.5vh'
          }}
          onClick={() => history.push('/manage-users')}
        >
          Manage Users and Admins
        </div>
      </div>

    </div>
  )
}

export default compose(
  withRouter
)(Settings)
