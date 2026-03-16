import { inject } from '@adonisjs/core'
import Product from '#models/product'

interface CreateProductDTO {
  name: string
  amount: number
}

@inject()
export default class CreateProductUseCase {
  public async execute(data: CreateProductDTO) {
    const product = await Product.create({
      name: data.name,
      amount: data.amount,
    })

    return product
  }
}
