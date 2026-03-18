export interface PaymentRequestDTO {
  amount: number
  name: string
  email: string
  cardNumber: string
  cvv: string
}

export interface PaymentResponseDTO {
  success: boolean
  gatewayTransactionId?: string
  errorMessage?: string
}

export interface RefundResponseDTO {
  success: boolean
  errorMessage?: string
}

export interface PaymentGatewayContracts {
  processPayment(data: PaymentRequestDTO): Promise<PaymentResponseDTO>
  refundPayment(gatewayTransactionId: string): Promise<RefundResponseDTO>
}
