import { test } from '@japa/runner'
import testUtils from '@adonisjs/core/services/test_utils'
import User, { Roles } from '#models/user'
import Product from '#models/product'

test.group('Products', (group) => {
  let adminUser: User
  let managerUser: User
  let financeUser: User
  let regularUser: User
  let product: Product

  group.each.setup(() => testUtils.db().wrapInGlobalTransaction())

  group.each.setup(async () => {
    adminUser = await User.create({
      email: 'admin_products@be.tech',
      password: 'password123',
      role: Roles.ADMIN,
    })

    managerUser = await User.create({
      email: 'manager_products@be.tech',
      password: 'password123',
      role: Roles.MANAGER,
    })

    financeUser = await User.create({
      email: 'finance_products@be.tech',
      password: 'password123',
      role: Roles.FINANCE,
    })

    regularUser = await User.create({
      email: 'regular_products@be.tech',
      password: 'password123',
      role: Roles.USER,
    })

    product = await Product.create({
      name: 'Produto Inicial',
      amount: 1000,
    })
  })

  test('deve retornar 401 se não estiver autenticado ao listar produtos', async ({ client }) => {
    const response = await client.get('/api/products')

    response.assertStatus(401)
  })

  test('deve listar produtos para usuário autenticado', async ({ client }) => {
    const response = await client.get('/api/products').loginAs(regularUser)

    response.assertStatus(200)
    response.assert.isArray(response.body())
    response.assert.lengthOf(response.body(), 1)
    response.assert.equal(response.body()[0].name, 'Produto Inicial')
  })

  test('deve retornar 403 se USER tentar criar produto', async ({ client }) => {
    const response = await client.post('/api/products').loginAs(regularUser).json({
      name: 'Produto Proibido',
      amount: 1500,
    })

    response.assertStatus(403)
  })

  test('deve retornar 422 se payload de criação for inválido', async ({ client }) => {
    const response = await client.post('/api/products').loginAs(adminUser).json({
      name: '',
      amount: 'invalido',
    })

    response.assertStatus(422)
  })

  test('deve criar produto com sucesso para ADMIN', async ({ client }) => {
    const response = await client.post('/api/products').loginAs(adminUser).json({
      name: 'Produto Novo',
      amount: 2500,
    })

    response.assertStatus(201)
    response.assertBodyContains({
      message: 'Produto cadastrado com sucesso',
    })

    const created = await Product.findBy('name', 'Produto Novo')
    response.assert.isNotNull(created)
    response.assert.equal(created?.amount, 2500)
  })

  test('deve criar produto com sucesso para FINANCE', async ({ client }) => {
    const response = await client.post('/api/products').loginAs(financeUser).json({
      name: 'Produto Finance',
      amount: 3000,
    })

    response.assertStatus(201)
    response.assertBodyContains({
      message: 'Produto cadastrado com sucesso',
    })
  })

  test('deve atualizar produto com sucesso', async ({ client }) => {
    const response = await client.patch(`/api/products/${product.id}`).loginAs(managerUser).json({
      name: 'Produto Atualizado',
      amount: 1800,
    })

    response.assertStatus(200)
    response.assertBodyContains({
      message: 'Produto atualizado com sucesso',
    })

    await product.refresh()
    response.assert.equal(product.name, 'Produto Atualizado')
    response.assert.equal(product.amount, 1800)
  })

  test('deve retornar 422 se payload de update for inválido', async ({ client }) => {
    const response = await client.patch(`/api/products/${product.id}`).loginAs(adminUser).json({
      name: '',
      amount: 'valor_invalido',
    })

    response.assertStatus(422)
  })

  test('deve remover produto com sucesso', async ({ client }) => {
    const response = await client.delete(`/api/products/${product.id}`).loginAs(adminUser)

    response.assertStatus(200)
    response.assertBodyContains({
      message: 'Produto removido com sucesso',
    })

    const deleted = await Product.find(product.id)
    response.assert.isNull(deleted)
  })
})
