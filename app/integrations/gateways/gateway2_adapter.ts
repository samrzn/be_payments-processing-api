import type {
  PaymentRequestDTO,
  PaymentResponseDTO,
  RefundResponseDTO,
  PaymentGatewayContracts,
} from './contracts/payment_gateway_contracts.ts'

import env from '#start/env'
import logger from '@adonisjs/core/services/logger'

export default class Gateway2Adapter implements PaymentGatewayContracts {
  private readonly baseUrl = env.get('GATEWAY2_URL')

  private readonly authHeaders = {
    'Content-Type': 'application/json',
    'Gateway-Auth-Token': 'tk_f2198cc671b5289fa856',
    'Gateway-Auth-Secret': '3d15e8ed6131446ea7e3456728b1211f',
  }

  public async processPayment(data: PaymentRequestDTO): Promise<PaymentResponseDTO> {
    try {
      const response = await fetch(`${this.baseUrl}/transacoes`, {
        method: 'POST',
        headers: this.authHeaders,
        body: JSON.stringify({
          valor: data.amount,
          nome: data.name,
          email: data.email,
          numeroCartao: data.cardNumber,
          cvv: data.cvv,
        }),
      })

      const responseData = (await response.json()) as {
        id?: string
        message?: string
        erro?: string
      }

      if (!response.ok) {
        const errorMessage =
          responseData.message || responseData.erro || 'Pagamento recusado pelo Gateway 2'

        logger.warn(`Gateway 2 recusou o pagamento. Motivo: ${errorMessage}`)

        return {
          success: false,
          errorMessage,
        }
      }

      return {
        success: true,
        gatewayTransactionId: responseData.id,
      }
    } catch (error: any) {
      logger.error({ err: error }, 'Erro de comunicação ao processar pagamento no Gateway 2')
      return { success: false, errorMessage: 'Erro de comunicação com o Gateway 2' }
    }
  }

  public async refundPayment(gatewayTransactionId: string): Promise<RefundResponseDTO> {
    try {
      const response = await fetch(`${this.baseUrl}/transacoes/reembolso`, {
        method: 'POST',
        headers: this.authHeaders,
        body: JSON.stringify({
          id: gatewayTransactionId,
        }),
      })

      if (!response.ok) {
        const responseData = (await response.json().catch(() => ({}))) as {
          message?: string
          erro?: string
        }
        const errorMessage =
          responseData.message || responseData.erro || 'Falha ao processar estorno no Gateway 2'

        logger.warn(`Gateway 2 recusou o estorno da transação ${gatewayTransactionId}`)

        return {
          success: false,
          errorMessage,
        }
      }

      return { success: true }
    } catch (error: any) {
      logger.error({ err: error }, 'Erro de comunicação ao processar estorno no Gateway 2')
      return { success: false, errorMessage: 'Erro de comunicação com o Gateway 2' }
    }
  }
}
