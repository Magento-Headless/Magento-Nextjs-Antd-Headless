import { NextPage } from 'next/types'
import styled from 'styled-components'

export const StyledMain = styled.main`
  position: relative;
  padding: 3rem;
`

const Home: NextPage = () => {
  return (
    <div>
      <StyledMain>
        <p>Home Page</p>
      </StyledMain>
    </div>
  )
}

export default Home
