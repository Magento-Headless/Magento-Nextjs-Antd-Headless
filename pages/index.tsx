import { NextPage } from 'next/types'
import { Button } from 'antd'
import styled from 'styled-components'

export const StyledMain = styled.main`
  position: relative;
  padding: 3rem;
`

const Home: NextPage = () => {
  return (
    <div>
      <StyledMain>
        <Button type="primary" htmlType="submit">
          OK
        </Button>
        <Button>Cancel</Button>
      </StyledMain>
    </div>
  )
}

export default Home
