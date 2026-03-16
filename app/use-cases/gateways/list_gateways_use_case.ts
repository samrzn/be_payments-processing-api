import { inject } from '@adonisjs/core'
import Gateway from '#models/gateway'

@inject()
export default class ListGatewaysUseCase {
  public async execute() {
    const gateways = await Gateway.query().orderBy('priority', 'asc')

    return gateways
  }
}
