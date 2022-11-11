import { action, makeAutoObservable, observable } from 'mobx'

class AppStore {
  constructor() {
    makeAutoObservable(this)
  }

  @observable currency: any = null
  @observable storeConfig: any = null

  @action setAppConfig(payload: any) {
    const { currency, storeConfig } = payload
    this.currency = currency
    this.storeConfig = storeConfig
  }
}

export default AppStore
