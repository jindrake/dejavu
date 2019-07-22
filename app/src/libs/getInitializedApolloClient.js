import { ApolloClient } from 'apollo-client'
import { InMemoryCache } from 'apollo-cache-inmemory'
import { createHttpLink } from 'apollo-link-http'
import { SubscriptionClient } from 'subscriptions-transport-ws'
import { getMainDefinition } from 'apollo-utilities'
import { setContext } from 'apollo-link-context'
import { onError } from 'apollo-link-error'
import { ApolloLink, split } from 'apollo-link'

export default (token) => {
  const errorLink = onError(({ graphQLErrors, networkError }) => {
    if (graphQLErrors) {
      graphQLErrors.map((error) => {
        if (error) {
          const { message, locations, path } = error
          console.error(
            `[GraphQL error]: Message: ${message}, Location: ${locations}, Path: ${path}, Error:`,
            error
          )
          return true
        }

        console.error('[GraphQL error]: Received null error')
        return true
      })
    }

    if (networkError) {
      console.error(`[Network error]: ${JSON.stringify(networkError)}`)
    }
  })

  let httpLink = createHttpLink({
    uri: process.env.REACT_APP_GRAPHQL_ENDPOINT,
    credentials: 'include',
    headers: token ? { Authorization: `Bearer ${token}` } : {}
  })

  const cache = new InMemoryCache().restore({})

  let finalTerminatingLink = null
  const wsLink = new SubscriptionClient(process.env.REACT_APP_GRAPHQL_WS_ENDPOINT, {
    reconnect: true,
    lazy: true,
    connectionParams: {
      headers: {
        authorization: token ? `Bearer ${token}` : ''
      }
    }
  })
  finalTerminatingLink = split(
    // split based on operation type
    ({ query }) => {
      const { kind, operation } = getMainDefinition(query)
      return kind === 'OperationDefinition' && operation === 'subscription'
    },
    wsLink,
    httpLink
  )

  const authLink = setContext((_, { headers }) => {
    const finalHeaders = { ...headers }
    if (token) {
      finalHeaders.authorization = `Bearer ${token}`
    }
    return finalHeaders
  })

  return new ApolloClient({
    connectToDevTools: process.browser,
    credentials: 'include',
    link: ApolloLink.from([errorLink, authLink, finalTerminatingLink]),
    cache
  })
}
