/* eslint-disable prettier/prettier */
import type { AdonisEndpoint } from '@tuyau/core/types'
import type { Registry } from './schema.d.ts'
import type { ApiDefinition } from './tree.d.ts'

const placeholder: any = {}

const routes = {
  'auth.login': {
    methods: ["POST"],
    pattern: '/api/login',
    tokens: [{"old":"/api/login","type":0,"val":"api","end":""},{"old":"/api/login","type":0,"val":"login","end":""}],
    types: placeholder as Registry['auth.login']['types'],
  },
  'gateways.index': {
    methods: ["GET","HEAD"],
    pattern: '/api/gateways',
    tokens: [{"old":"/api/gateways","type":0,"val":"api","end":""},{"old":"/api/gateways","type":0,"val":"gateways","end":""}],
    types: placeholder as Registry['gateways.index']['types'],
  },
  'gateways.toggle': {
    methods: ["PATCH"],
    pattern: '/api/gateways/:id/toggle',
    tokens: [{"old":"/api/gateways/:id/toggle","type":0,"val":"api","end":""},{"old":"/api/gateways/:id/toggle","type":0,"val":"gateways","end":""},{"old":"/api/gateways/:id/toggle","type":1,"val":"id","end":""},{"old":"/api/gateways/:id/toggle","type":0,"val":"toggle","end":""}],
    types: placeholder as Registry['gateways.toggle']['types'],
  },
  'gateways.update_priority': {
    methods: ["PATCH"],
    pattern: '/api/gateways/priority',
    tokens: [{"old":"/api/gateways/priority","type":0,"val":"api","end":""},{"old":"/api/gateways/priority","type":0,"val":"gateways","end":""},{"old":"/api/gateways/priority","type":0,"val":"priority","end":""}],
    types: placeholder as Registry['gateways.update_priority']['types'],
  },
} as const satisfies Record<string, AdonisEndpoint>

export { routes }

export const registry = {
  routes,
  $tree: {} as ApiDefinition,
}

declare module '@tuyau/core/types' {
  export interface UserRegistry {
    routes: typeof routes
    $tree: ApiDefinition
  }
}
