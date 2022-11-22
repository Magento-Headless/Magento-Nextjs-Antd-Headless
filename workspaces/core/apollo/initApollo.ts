import {
  ApolloClient,
  ApolloLink,
  InMemoryCache,
  HttpLink
} from '@apollo/client'
import { onError } from '@apollo/client/link/error'
import { isEmpty, merge } from 'lodash'
import { parseCookies } from 'nookies'

import { shrinkQuery } from './shrinkQuery'
import { typePolicies } from './policies'

type ApolloStruct = {
  cookies: any
  reduxState: any
  domain: string
}

let apolloClient: any = null

const customFetchToShrinkQuery = (uri: string, options: any) => {
  let url = uri
  if (options.method === 'GET') {
    url = shrinkQuery(uri)
  }
  return fetch(url, options)
}

const createApolloClient = ({ cookies, reduxState, domain }: ApolloStruct) => {
  const isVercelDeploy: boolean =
    process.env.REACT_APP_DEPLOY_PLATFORM === 'vercel'
  const vercelURL: string = `${domain}/`
  const localURL: string = `${process.env.REACT_APP_HOST_URL}`
  const apiURL: string = isVercelDeploy ? vercelURL : localURL
  const httpLink = new HttpLink({
    uri: `${
      typeof window === 'undefined' ? `${apiURL}` : `${window.location.origin}/`
    }api/graphql`,
    credentials: 'same-origin',
    fetch: customFetchToShrinkQuery,
    useGETForQueries: true
  })

  // HTTP headers middleware
  const middlewareLink = new ApolloLink((operation, forward) => {
    const exsistCookies =
      typeof window === 'undefined' ? cookies : parseCookies()
    const storeCode = !isEmpty(reduxState)
      ? reduxState.app.storeConfig.code
      : ''
    const currencyCode = !isEmpty(reduxState)
      ? reduxState.app.currency.code
      : ''
    // Support WireMock for customer headers
    const context = operation.getContext()
    operation.setContext({
      headers: {
        Authorization: exsistCookies.access_token
          ? `Bearer ${exsistCookies.access_token}`
          : null,
        Store: exsistCookies?.store_code ?? storeCode,
        'Content-Currency': exsistCookies?.currency_code ?? currencyCode,
        ...context?.headers
      }
    })

    return forward(operation)
  })

  const errorLink = onError(({ graphQLErrors, networkError }) => {
    const isServer: boolean = typeof window === 'undefined'

    if (graphQLErrors) {
      graphQLErrors.forEach(({ message }, index) => {
        graphQLErrors[index].message = message.replace('GraphQL error: ', '')

        if (isServer) {
          console.error(graphQLErrors[index].message)
        } else {
          console.error(graphQLErrors[index].message)
        }
      })
    }

    if (networkError) {
      if (isServer) {
        console.error(`[Network error]: ${networkError}`)
      } else {
        console.error(networkError)
      }
    }
  })

  const apolloLink = middlewareLink.concat(httpLink)
  const isClient = typeof window !== 'undefined'

  return new ApolloClient({
    link: errorLink.concat(apolloLink),
    cache: new InMemoryCache({
      addTypename: false,
      typePolicies
    }).restore({}),
    connectToDevTools: isClient,
    ssrMode: !isClient,
    defaultOptions: {
      query: {
        fetchPolicy: 'cache-first'
      }
    }
  })
}

export const initApollo = ({
  apolloState = {},
  cookies = {},
  reduxState = {},
  domain = ''
}) => {
  const _apolloClient =
    apolloClient ??
    createApolloClient({
      cookies,
      reduxState,
      domain
    })

  // If your page has Next.js data fetching methods that use Apollo Client, the initial state
  if (apolloState) {
    // Get existing cache, loaded during client side data fetching
    const existingCache = _apolloClient.extract()

    // Merge the existing cache into data passed from getStaticProps/getServerSideProps
    const data = merge(apolloState, existingCache)

    // Restore the cache with the merged data
    _apolloClient.cache.restore(data)
  }
  // For SSG and SSR always create a new Apollo Client
  if (typeof window === 'undefined') return _apolloClient
  // Create the Apollo Client once in the client
  if (!apolloClient) apolloClient = _apolloClient

  return _apolloClient
}
