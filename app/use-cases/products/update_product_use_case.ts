import { inject } from '@adonisjs/core'
import Product from '#models/product'

interface UpdateProductDTO {
  id: string
  name?: string
  amount?: number
}

@inject()
export default class UpdateProductUseCase {
  public async execute({ id, name, amount }: UpdateProductDTO) {
    const product = await Product.findOrFail(id)

    if (name !== undefined) product.name = name
    if (amount !== undefined) product.amount = amount

    await product.save()

    return product
  }
}
