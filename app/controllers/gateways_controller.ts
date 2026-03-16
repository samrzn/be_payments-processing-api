import type { HttpContext } from '@adonisjs/core/http'
import { inject } from '@adonisjs/core'

import { toggleGatewayValidator, updatePriorityValidator } from '#validators/gateway'

import ListGatewaysUseCase from '../use-cases/gateways/list_gateways_use_case.ts'
import ToggleGatewayUseCase from '../use-cases/gateways/toggle_gateway_use_case.ts'
import UpdateGatewayPriorityUseCase from '../use-cases/gateways/update_gateway_priority_use_case.ts'

@inject()
export default class GatewaysController {
  constructor(
    private readonly listGatewaysUseCase: ListGatewaysUseCase,
    private readonly toggleGatewayUseCase: ToggleGatewayUseCase,
    private readonly updateGatewayPriorityUseCase: UpdateGatewayPriorityUseCase
  ) {}

  public async index({ response }: HttpContext) {
    const gateways = await this.listGatewaysUseCase.execute()
    return response.ok(gateways)
  }

  public async toggle({ request, params, response }: HttpContext) {
    const payload = await request.validateUsing(toggleGatewayValidator)

    const gateway = await this.toggleGatewayUseCase.execute({
      id: params.id,
      isActive: payload.is_active,
    })

    return response.ok({
      message: 'Status do gateway atualizado com sucesso',
      gateway,
    })
  }

  public async updatePriority({ request, response }: HttpContext) {
    const payload = await request.validateUsing(updatePriorityValidator)

    try {
      const result = await this.updateGatewayPriorityUseCase.execute(payload.gateways)

      return response.ok(result)
    } catch (error) {
      return response.badRequest({ message: error.message })
    }
  }
}
