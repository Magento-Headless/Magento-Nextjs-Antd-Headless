import { Component as HeadlessComponent } from 'react'
import { getDataFromTree } from '@apollo/client/react/ssr'
import { parseCookies } from 'nookies'

import { initApollo } from './initApollo'

export const withApollo = (App: any) => {
  return class AppWithApollo extends HeadlessComponent {
    private apolloClient: any

    static async getInitialProps(appContext: any) {
      const { Component, router } = appContext
      const cookies: any = parseCookies(appContext.ctx)
      const isServer: boolean = typeof window === 'undefined'
      const proto: string = isServer
        ? appContext.ctx?.req?.headers?.['x-forwarded-proto'] ?? ''
        : window.location.protocol
      const host: string = isServer
        ? appContext.ctx?.req?.headers?.host ?? ''
        : window.location.host
      const domain: string = isServer
        ? `${proto}://${host}`
        : `${proto}//${host}`

      const apollo = initApollo({
        apolloState: {},
        cookies,
        domain
      })

      // Provide the apollo to getInitialProps of pages
      appContext.ctx.apollo = apollo

      // Run wrapped getInitialProps methods
      let appProps = {}
      if (typeof App.getInitialProps === 'function') {
        appProps = await App.getInitialProps(appContext)
      }

      // Run all GraphQL queries
      if (typeof window === 'undefined') {
        await getDataFromTree(
          <App
            {...appProps}
            Component={Component}
            router={router}
            apolloClient={apollo}
          />
        )
      }

      // Extract query data from the Apollo store
      const apolloState = apollo.cache.extract()

      return {
        ...appProps,
        apolloState,
        cookies
      }
    }

    constructor(props: any) {
      super(props)
      this.apolloClient = initApollo(props)
    }

    render() {
      return <App apolloClient={this.apolloClient} {...this.props} />
    }
  }
}
