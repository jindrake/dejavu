import ApolloClient from 'apollo-boost'
import { ApolloProvider } from 'react-apollo'
import React from 'react'

export default () => (WrappedComponent) => (props) => {
  const client = new ApolloClient({
    uri: process.env.REACT_APP_GRAPHQL_ENDPOINT
  })
  return (
    <ApolloProvider client={client}>
      <WrappedComponent {...props} client={client} />
    </ApolloProvider>
  )
}
