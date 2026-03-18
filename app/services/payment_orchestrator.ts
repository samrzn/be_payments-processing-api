import { inject } from '@adonisjs/core'
import logger from '@adonisjs/core/services/logger'
import Gateway from '#models/gateway'
import GatewayFactory from '../integrations/gateways/factory/gateway_factory.ts'
import { PaymentRequestDTO } from '../integrations/gateways/contracts/payment_gateway_contracts.ts'

export interface OrchestratorResponse {
  gatewayId: string
  gatewayTransactionId: string
}

@inject()
export default class PaymentOrchestrator {
  public async process(data: PaymentRequestDTO): Promise<OrchestratorResponse> {
    const gateways = await Gateway.query().where('isActive', true).orderBy('priority', 'asc')

    if (gateways.length === 0) {
      throw new Error('Nenhum gateway de pagamento disponível no momento.')
    }

    for (const gateway of gateways) {
      try {
        logger.info(
          `[Motor de Pagamento] Tentando cobrar no ${gateway.name} (Prioridade: ${gateway.priority})...`
        )

        const adapter = GatewayFactory.create(gateway.name)

        const result = await adapter.processPayment(data)

        if (result.success && result.gatewayTransactionId) {
          logger.info(`[Motor de Pagamento] Sucesso! Venda aprovada no ${gateway.name}.`)

          return {
            gatewayId: gateway.id,
            gatewayTransactionId: result.gatewayTransactionId,
          }
        }

        logger.warn(
          `[Motor de Pagamento] Recusado no ${gateway.name}: ${result.errorMessage}. Iniciando Fallback...`
        )
      } catch (error: any) {
        logger.error(
          `[Motor de Pagamento] Erro crítico no adapter do ${gateway.name}: ${error.message}`
        )
      }
    }

    logger.error(
      `[Motor de Pagamento] Falha por indisponibilidade. Todos os gateways recusaram a transação.`
    )
    throw new Error(
      'Pagamento recusado em todas as operadoras. Verifique os dados do cartão e tente novamente.'
    )
  }
}
