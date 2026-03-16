import { inject } from '@adonisjs/core'
import Gateway from '#models/gateway'

interface ToggleDTO {
  id: string
  isActive: boolean
}

@inject()
export default class ToggleGatewayUseCase {
  public async execute({ id, isActive }: ToggleDTO) {
    const gateway = await Gateway.findOrFail(id)
    gateway.isActive = isActive

    await gateway.save()

    return gateway
  }
}
