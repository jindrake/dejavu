import React from 'react'
import { compose } from 'react-apollo'
import styled from 'styled-components'
import { Button } from 'reactstrap'
import { withRouter } from 'react-router-dom'

const AvatarContainer = styled.div`
  border-radius: 50%;
  width: 40%;
  background-color: white;
  height: 120px;
`

const ProfileInfo = styled.div`
  width: 100%;
  display: flex;
  justify-content: center;
  padding-top: 20%;
  text-align: center;
`

const CenteredText = styled.div`
  width: 100%;
  display: flex;
  justify-content: center;
  padding: 5px;
`

const Container = styled.div`
  height: 100%;
  width: 100%;
`

const Profile = ({ user, history }) => {
  return (
    <Container>
      <ProfileInfo>
        <AvatarContainer />
      </ProfileInfo>
      <CenteredText>
        {user.first_name} {user.last_name}
      </CenteredText>
      <hr />
      <CenteredText>Your created topics</CenteredText>
      <br />
      <CenteredText>
        <Button
          color='link'
          onClick={() => {
            history.push('/topic/create')
          }}
        >
          + create new topic
        </Button>
      </CenteredText>
      <hr />
      <CenteredText>Recent topics</CenteredText>
    </Container>
  )
}

export default compose(withRouter)(Profile)
