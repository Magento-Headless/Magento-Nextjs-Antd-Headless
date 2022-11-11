import { action, makeAutoObservable, observable } from 'mobx'

class CartStore {
  constructor() {
    makeAutoObservable(this)
  }

  @observable cartId: any = null
  @observable cartDetail: any = null

  @action setCartId(payload: any) {
    this.cartId = payload
  }

  @action setAppConfig(payload: any) {
    this.cartId = payload.id
    this.cartDetail = payload
  }
}

export default CartStore
