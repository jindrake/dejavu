import React from 'react'
import { withRouter } from 'react-router-dom'
import compose from 'recompose/compose'

const Settings = ({ history }) => {
  return (
    <div>
      <div
        style={{
          border: '2px solid white',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          borderRadius: '10px',
          padding: '5px',
          backgroundColor: 'white',
          fontWeight: '500'
        }}
        onClick={() => history.push('/manage-users')}
      >
        Manage Topic
      </div>
    </div>
  )
}

export default compose(
  withRouter
)(Settings)
