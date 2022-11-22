import { AppProps } from 'next/app'
import { ConfigProvider } from 'antd'
import { ThemeProvider } from 'styled-components'

import { theme } from '@config/theme'

const App = ({ Component, pageProps }: AppProps) => {
  return (
    <ThemeProvider theme={theme}>
      <ConfigProvider prefixCls={theme.prefix}>
        <Component {...pageProps} />
      </ConfigProvider>
    </ThemeProvider>
  )
}

export default App
