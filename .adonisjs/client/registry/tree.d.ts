/* eslint-disable prettier/prettier */
import type { routes } from './index.ts'

export interface ApiDefinition {
  auth: {
    login: typeof routes['auth.login']
    signup: typeof routes['auth.signup']
  }
  gateways: {
    index: typeof routes['gateways.index']
    toggle: typeof routes['gateways.toggle']
    updatePriority: typeof routes['gateways.update_priority']
  }
  products: {
    index: typeof routes['products.index']
    store: typeof routes['products.store']
  }
}
