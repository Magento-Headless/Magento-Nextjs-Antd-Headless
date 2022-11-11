import { observable, action } from 'mobx'

class AppStore {
  @observable currency: any = null
  @observable storeConfig: any = null

  @action setAppConfig(payload: any) {
    const { currency, storeConfig } = payload
    this.currency = currency
    this.storeConfig = storeConfig
  }
}

export default AppStore
