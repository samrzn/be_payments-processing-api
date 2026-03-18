import type { PaymentGatewayContracts } from '../contracts/payment_gateway_contracts.ts'
import Gateway1Adapter from '../gateway1_adapter.ts'
import Gateway2Adapter from '../gateway2_adapter.ts'

export default class GatewayFactory {
  public static create(gatewayName: string): PaymentGatewayContracts {
    switch (gatewayName) {
      case 'Gateway 1':
        return new Gateway1Adapter()
      case 'Gateway 2':
        return new Gateway2Adapter()
      default:
        throw new Error(`Nenhum Adapter implementado para o gateway: ${gatewayName}`)
    }
  }
}
