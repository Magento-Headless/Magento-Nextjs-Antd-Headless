import type { NextPage } from 'next'
import { Button } from 'antd'
import styled from 'styled-components'

export const StyledMain = styled.main`
  position: relative;
  padding: 3rem;
`

const Home: NextPage = () => {
  console.log(Button)
  return (
    <div>
      <StyledMain>
        {/* <Button type="primary" htmlType="submit">
          OK
        </Button>
        <Button>Cancel</Button> */}
      </StyledMain>
    </div>
  )
}

export default Home
