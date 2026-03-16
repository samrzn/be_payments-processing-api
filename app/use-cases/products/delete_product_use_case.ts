import { inject } from '@adonisjs/core'
import Product from '#models/product'

@inject()
export default class DeleteProductUseCase {
  public async execute(id: string) {
    const product = await Product.findOrFail(id)
    await product.delete()
  }
}
