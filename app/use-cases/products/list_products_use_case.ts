import { inject } from '@adonisjs/core'
import Product from '#models/product'

@inject()
export default class ListProductsUseCase {
  public async execute() {
    const products = await Product.query().orderBy('name', 'asc')

    return products
  }
}
