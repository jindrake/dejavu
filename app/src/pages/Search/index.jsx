import React, { useState } from 'react'
import { Label, Input } from 'reactstrap'
import { withRouter } from 'react-router-dom'
import { debounce } from 'lodash'
import gql from 'graphql-tag'
import { Query, compose } from 'react-apollo'
import styled from 'styled-components'

const FETCH_TOPIC = gql`
  query fetchTopic($name: String) {
    topic(where: { name: { _ilike: $name } }){
      id
      name
      description
      creator {
        id
        first_name
        last_name
      }
    }
  }
`

const Search = ({ user, history }) => {
  const [searchValue, setSearchValue] = useState('')

  let debounceEvent = (...args) => {
    debounceEvent = debounce(...args)
    return e => {
      e.persist()
      return debounceEvent(e)
    }
  }

  const handleChange = (e) => {
    setSearchValue(e.target.value)
  }

  return (
    <div>
      <Label for='search'>Search Topic Name</Label>
      <Input
        type='text'
        name='search'
        id='search'
        placeholder='search topic'
        onChange={debounceEvent(handleChange, 500)}
      />
      <Query query={FETCH_TOPIC} variables={{ name: `%${searchValue}%` }}>
        {({ data, error, loading }) => {
          if (error) {
            console.log(error)
            return <div>Error: {JSON.stringify(error)}</div>
          }
          if (loading) return <div>Loading Symbol...</div>
          return (
            <div>
              <h1>Topics</h1>
              {
                data.topic && data.topic.map(topic => (
                  <Wrapper
                    key={topic.id}
                    onClick={() => {
                      history.push(`topic/${topic.id}`)
                    }}
                  >
                    <b>{topic.name}</b>
                    <p>{topic.description}</p>
                    <h3>{`by: ${topic.creator.first_name}  ${topic.creator.last_name}`}</h3>
                  </Wrapper>
                ))
              }
              {/* {console.log(data)} */}
            </div>
          )
        }}
      </Query>
    </div>
  )
}

const Wrapper = styled.div`
  border: 2px solid red
`

export default compose(
  withRouter
)(Search)
