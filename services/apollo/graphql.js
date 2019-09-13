const fetch = require('node-fetch')
const ApolloClient = require('apollo-boost').default

const client = new ApolloClient({
  uri: process.env.GRAPHQL_ENDPOINT,
  headers: {
    'X-Hasura-Access-Key': process.env.HASURA_GRAPHQL_ACCESS_KEY
  },
  fetch: fetch
})

client.defaultOptions = {
  watchQuery: {
    fetchPolicy: 'no-cache',
    errorPolicy: 'ignore'
  },
  query: {
    fetchPolicy: 'no-cache',
    errorPolicy: 'all'
  }
}

exports.query = (query, variables) => client.query({
  query,
  variables
})

exports.mutate = (mutation, variables) => client.mutate({
  mutation,
  variables
})
