import React, { useState } from 'react'
import { Label, Input } from 'reactstrap'
import { withRouter } from 'react-router-dom'
import { debounce } from 'lodash'
import gql from 'graphql-tag'
import { Query, compose } from 'react-apollo'

// const FETCH_TOPIC = gql`
//   query fetchTopic($name: String) {
//     topic(where: { name: { _like: $name } }) {
//       name
//       description
//     }
//   }
// `

const FETCH_TOPIC = gql`
  query fetchTopic {
    topic {
      name
      description
    }
  }
`

const Search = () => {
  const [searchValue, setSearchValue] = useState('')
  // const [results, setResults] = useState([])

  let debounceEvent = (...args) => {
    // console.log('ARGS:', ...args)
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
      <Label for='search'>Search</Label>
      <Input
        type='text'
        name='search'
        id='search'
        placeholder='search topic'
        onChange={debounceEvent(handleChange, 500)}
      />
      <Label for='exampleText'>Text Area</Label>
      <Input
        type='textarea'
        value={searchValue}
        readOnly
      />
      <Query query={FETCH_TOPIC}>
        {({ data, error, loading }) => {
          if (error) {
            console.log(error)
            return <div>Error: {JSON.stringify(error)}</div>
          }
          if (loading) return <div>Loading Symbol...</div>
          return (
            <div>
              {console.log(data)}
            </div>
          )
        }}
      </Query>
    </div>
  )
}

export default compose(
  withRouter
)(Search)
