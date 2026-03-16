/* eslint-disable prettier/prettier */
/// <reference path="../manifest.d.ts" />

import type { ExtractBody, ExtractErrorResponse, ExtractQuery, ExtractQueryForGet, ExtractResponse } from '@tuyau/core/types'
import type { InferInput, SimpleError } from '@vinejs/vine/types'

export type ParamValue = string | number | bigint | boolean

export interface Registry {
  'auth.login': {
    methods: ["POST"]
    pattern: '/api/login'
    types: {
      body: ExtractBody<InferInput<(typeof import('#app/validators/user').loginValidator)>>
      paramsTuple: []
      params: {}
      query: ExtractQuery<InferInput<(typeof import('#app/validators/user').loginValidator)>>
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/auth_controller').default['login']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/auth_controller').default['login']>>> | { status: 422; response: { errors: SimpleError[] } }
    }
  }
  'gateways.index': {
    methods: ["GET","HEAD"]
    pattern: '/api/gateways'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/gateways_controller').default['index']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/gateways_controller').default['index']>>>
    }
  }
  'gateways.toggle': {
    methods: ["PATCH"]
    pattern: '/api/gateways/:id/toggle'
    types: {
      body: ExtractBody<InferInput<(typeof import('#validators/gateway_validator').toggleGatewayValidator)>>
      paramsTuple: [ParamValue]
      params: { id: ParamValue }
      query: ExtractQuery<InferInput<(typeof import('#validators/gateway_validator').toggleGatewayValidator)>>
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/gateways_controller').default['toggle']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/gateways_controller').default['toggle']>>> | { status: 422; response: { errors: SimpleError[] } }
    }
  }
  'gateways.update_priority': {
    methods: ["PATCH"]
    pattern: '/api/gateways/priority'
    types: {
      body: ExtractBody<InferInput<(typeof import('#validators/gateway_validator').updatePriorityValidator)>>
      paramsTuple: []
      params: {}
      query: ExtractQuery<InferInput<(typeof import('#validators/gateway_validator').updatePriorityValidator)>>
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/gateways_controller').default['updatePriority']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/gateways_controller').default['updatePriority']>>> | { status: 422; response: { errors: SimpleError[] } }
    }
  }
}
