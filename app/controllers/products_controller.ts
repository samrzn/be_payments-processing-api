import type { HttpContext } from '@adonisjs/core/http'
import { inject } from '@adonisjs/core'

import { createProductValidator } from '#validators/product_validator'
import ListProductsUseCase from '../use-cases/products/list_products_use_case.ts'
import CreateProductUseCase from '../use-cases/products/create_product_use_case.ts'

@inject()
export default class ProductsController {
  constructor(
    private readonly listProductsUseCase: ListProductsUseCase,
    private readonly createProductUseCase: CreateProductUseCase
  ) {}

  public async index({ response }: HttpContext) {
    const products = await this.listProductsUseCase.execute()

    return response.ok(products)
  }

  public async store({ request, response }: HttpContext) {
    const payload = await request.validateUsing(createProductValidator)

    const product = await this.createProductUseCase.execute({
      name: payload.name,
      amount: payload.amount,
    })

    return response.created({
      message: 'Produto cadastrado com sucesso',
      product,
    })
  }
}
