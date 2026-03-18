import type {
  PaymentRequestDTO,
  PaymentResponseDTO,
  RefundResponseDTO,
  PaymentGatewayContracts,
} from './contracts/payment_gateway_contracts.ts'

import env from '#start/env'
import logger from '@adonisjs/core/services/logger'

export default class Gateway1Adapter implements PaymentGatewayContracts {
  private readonly baseUrl = env.get('GATEWAY1_URL')

  private async authenticate(): Promise<string> {
    try {
      const response = await fetch(`${this.baseUrl}/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: 'dev@betalent.tech',
          token: 'FEC9BB078BF338F464F96B48089EB498',
        }),
      })

      if (!response.ok) {
        throw new Error(`HTTP Error: ${response.status}`)
      }

      const data = (await response.json()) as { token: string }
      return data.token
    } catch (error) {
      logger.error({ err: error }, 'Falha ao autenticar no Gateway 1')
      throw new Error('Gateway 1 indisponível para autenticação')
    }
  }

  public async processPayment(data: PaymentRequestDTO): Promise<PaymentResponseDTO> {
    try {
      const token = await this.authenticate()

      const response = await fetch(`${this.baseUrl}/transactions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          amount: data.amount,
          name: data.name,
          email: data.email,
          cardNumber: data.cardNumber,
          cvv: data.cvv,
        }),
      })

      const responseData = (await response.json()) as { id?: string; message?: string }

      if (!response.ok) {
        logger.warn(
          `Gateway 1 recusou o pagamento. Motivo: ${responseData.message || 'Desconhecido'}`
        )
        return {
          success: false,
          errorMessage: responseData.message || 'Pagamento recusado pelo Gateway 1',
        }
      }

      return {
        success: true,
        gatewayTransactionId: responseData.id,
      }
    } catch (error: any) {
      logger.error({ err: error }, 'Erro de comunicação ao processar pagamento no Gateway 1')
      return { success: false, errorMessage: 'Erro de comunicação com o Gateway 1' }
    }
  }

  public async refundPayment(gatewayTransactionId: string): Promise<RefundResponseDTO> {
    try {
      const token = await this.authenticate()

      const response = await fetch(
        `${this.baseUrl}/transactions/${gatewayTransactionId}/charge_back`,
        {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )

      if (!response.ok) {
        const responseData = (await response.json().catch(() => ({}))) as { message?: string }
        logger.warn(`Gateway 1 recusou o estorno da transação ${gatewayTransactionId}`)
        return {
          success: false,
          errorMessage: responseData.message || 'Falha ao processar estorno no Gateway 1',
        }
      }

      return { success: true }
    } catch (error: any) {
      logger.error({ err: error }, 'Erro de comunicação ao processar estorno no Gateway 1')
      return { success: false, errorMessage: 'Erro de comunicação com o Gateway 1' }
    }
  }
}
