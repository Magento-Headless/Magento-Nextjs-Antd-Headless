import { AppProps } from 'next/app'
import { Provider } from 'mobx-react'
import { ThemeProvider } from 'styled-components'

import stores from '../store'

const App = ({ Component, pageProps }: AppProps) => {
  return (
    <Provider {...stores}>
      <ThemeProvider theme={{}}>
        <Component {...pageProps} />
      </ThemeProvider>
    </Provider>
  )
}

export default App
