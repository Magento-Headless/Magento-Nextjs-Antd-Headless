import { Button, Input } from 'antd'

import { StyledHeader } from './styled'

const Header = () => {
  return (
    <StyledHeader>
      <Button type="primary">Header</Button>
      <Input />
    </StyledHeader>
  )
}

export default Header
