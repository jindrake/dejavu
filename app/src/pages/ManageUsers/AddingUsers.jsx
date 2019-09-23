import React, { useState } from 'react'
import { StyledInput } from '../../components/'
import gql from 'graphql-tag'
import compose from 'recompose/compose'
import { graphql } from '@apollo/react-hoc'
import { withRouter } from 'react-router-dom'

const INSERT_TOPIC_USER = gql`
  mutation insertTopicUser($topicUser: [topic_user_insert_input!]!) {
    insert_topic_user(objects: $topicUser) {
      affected_rows
    }
  }
`

const AddingUsers = ({ user, history, location, insertTopicUser }) => {
  const [searchValue, setSearchValue] = useState('')
  const { state: { topicId, type } } = location
  // console.log(topicId)
  // console.log(type)
  return (
    <div>
      <div
        style={{
          fontSize: '2.5vh',
          fontWeight: '600',
          paddingTop: '3px',
          paddingBottom: '3px',
          paddingLeft: '5px',
          paddingRight: '5px',
          backgroundColor: 'white',
          color: 'black',
          marginBottom: '10px',
          borderRadius: '5px',
          width: '10vh',
          textAlign: 'center'
        }}
        onClick={() => history.goBack()}
      >
        Back
      </div>
      <div style={{ color: 'white', fontWeight: '600', fontSize: '3vh' }}>
        {type === 'user' ? 'Manage User' : 'Manage Admin'}
      </div>
      <div
        style={{
          flexDirection: 'row',
          display: 'flex',
          alignItems: 'flex-end',
          justifyContent: 'space-evenly'
        }}
      >
        <StyledInput
          type='text'
          name='invite-email'
          id='invite-email'
          placeholder='Insert Email'
          onChange={(event) => {
            setSearchValue(event.target.value)
          }}
        />
        <div
          style={{
            height: '5vh',
            backgroundColor: 'green',
            padding: '5px',
            fontSize: '2vh',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            width: '35vw',
            borderRadius: '10px',
            marginLeft: '10px',
            color: 'white',
            fontWeight: '500'
          }}
          onClick={() => {
            if (searchValue.length > 0) {
              if (type === 'user') {
                console.log(searchValue)
                insertTopicUser({
                  variables: {
                    topicUser: {
                      email: searchValue,
                      is_allowed: true,
                      topic_id: topicId
                    }
                  }
                })
                  .then((res) => {
                    console.log(res)
                  })
                  .catch((err) => {
                    console.log(err.message)
                  })
              } else {
                console.log('add admin!')
              }
            }
          }}
        >
          {`Add ${type}`}
        </div>
      </div>
      <div style={{ color: 'white', fontWeight: '500', fontSize: '3vh' }}>
        {`Current ${type}s:`}
      </div>
    </div>
  )
}

export default compose(
  withRouter,
  graphql(INSERT_TOPIC_USER, { name: 'insertTopicUser' })
)(AddingUsers)
