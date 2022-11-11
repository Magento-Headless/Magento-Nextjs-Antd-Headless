import AppStore from './app'
import CartStore from './cart'

const stores: any = {
  app: new AppStore(),
  cart: new CartStore()
}

export default stores
