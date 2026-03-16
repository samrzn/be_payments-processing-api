import '@adonisjs/core/types/http'

type ParamValue = string | number | bigint | boolean

export type ScannedRoutes = {
  ALL: {
    'auth.login': { paramsTuple?: []; params?: {} }
    'auth.signup': { paramsTuple?: []; params?: {} }
    'gateways.index': { paramsTuple?: []; params?: {} }
    'gateways.toggle': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'gateways.update_priority': { paramsTuple?: []; params?: {} }
    'products.index': { paramsTuple?: []; params?: {} }
    'products.store': { paramsTuple?: []; params?: {} }
  }
  POST: {
    'auth.login': { paramsTuple?: []; params?: {} }
    'auth.signup': { paramsTuple?: []; params?: {} }
    'products.store': { paramsTuple?: []; params?: {} }
  }
  GET: {
    'gateways.index': { paramsTuple?: []; params?: {} }
    'products.index': { paramsTuple?: []; params?: {} }
  }
  HEAD: {
    'gateways.index': { paramsTuple?: []; params?: {} }
    'products.index': { paramsTuple?: []; params?: {} }
  }
  PATCH: {
    'gateways.toggle': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'gateways.update_priority': { paramsTuple?: []; params?: {} }
  }
}
declare module '@adonisjs/core/types/http' {
  export interface RoutesList extends ScannedRoutes {}
}