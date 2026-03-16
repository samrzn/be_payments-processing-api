import { inject } from '@adonisjs/core'
import Gateway from '#models/gateway'
import db from '@adonisjs/lucid/services/db'
import { Exception } from '@adonisjs/core/exceptions'

interface GatewayPriorityDTO {
  id: string
  priority: number
}

@inject()
export default class UpdateGatewayPriorityUseCase {
  public async execute(gatewaysData: GatewayPriorityDTO[]) {
    const trx = await db.transaction()

    try {
      for (const item of gatewaysData) {
        const gateway = await Gateway.findOrFail(item.id, { client: trx })

        gateway.priority = item.priority

        await gateway.useTransaction(trx).save()
      }

      await trx.commit()

      return { message: 'Prioridades atualizadas com sucesso' }
    } catch (error) {
      await trx.rollback()

      throw new Exception('Falha ao atualizar prioridades. Nenhuma alteração foi salva.')
    }
  }
}
