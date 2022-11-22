import 'styled-components'

declare module 'styled-components' {
  export interface DefaultTheme {
    prefix: string
    colors: {
      white: string
      black: string
    }
  }
}
