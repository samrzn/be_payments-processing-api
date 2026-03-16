import { test } from '@japa/runner'
import User, { Roles } from '#models/user'
import Gateway from '#models/gateway'

test.group('Gateways', (group) => {
  let adminUser: User
  let regularUser: User
  let gateway1: Gateway
  let gateway2: Gateway

  group.each.setup(async () => {
    await Gateway.query().delete()
    await User.query().delete()

    adminUser = await User.create({
      email: 'admin_test@be.tech',
      password: 'password123',
      role: Roles.ADMIN,
    })

    regularUser = await User.create({
      email: 'user_test@be.tech',
      password: 'password123',
      role: Roles.USER,
    })

    gateway1 = await Gateway.create({ name: 'Gateway 1', priority: 1, isActive: true })
    gateway2 = await Gateway.create({ name: 'Gateway 2', priority: 2, isActive: true })
  })

  test('deve retornar 401 se não estiver autenticado', async ({ client }) => {
    const response = await client.get('/api/gateways')
    response.assertStatus(401)
  })

  test('deve retornar 403 Forbidden se um USER comum tentar acessar', async ({ client }) => {
    const response = await client.get('/api/gateways').loginAs(regularUser)

    response.assertStatus(403)
    response.assertBodyContains({
      message: 'Acesso negado: Você não tem permissão para realizar esta ação.',
    })
  })

  test('deve listar os gateways ordenados por prioridade para o ADMIN', async ({ client }) => {
    const response = await client.get('/api/gateways').loginAs(adminUser)

    response.assertStatus(200)

    response.assert.lengthOf(response.body(), 2)
    response.assert.equal(response.body()[0].name, 'Gateway 1')
  })

  test('deve falhar no toggle se enviar payload invalido (VineJS)', async ({ client }) => {
    const response = await client
      .patch(`/api/gateways/${gateway1.id}/toggle`)
      .loginAs(adminUser)
      .json({ is_active: 'texto_invalido' })

    response.assertStatus(422)
  })

  test('deve ativar/desativar um gateway com sucesso', async ({ client }) => {
    const response = await client
      .patch(`/api/gateways/${gateway1.id}/toggle`)
      .loginAs(adminUser)
      .json({ is_active: false })

    response.assertStatus(200)
    response.assert.isFalse(response.body().gateway.isActive)

    await gateway1.refresh()
    response.assert.isFalse(gateway1.isActive)
  })

  test('deve atualizar as prioridades em lote com sucesso', async ({ client }) => {
    const payload = {
      gateways: [
        { id: gateway1.id, priority: 2 },
        { id: gateway2.id, priority: 1 },
      ],
    }

    const response = await client.patch('/api/gateways/priority').loginAs(adminUser).json(payload)

    response.assertStatus(200)

    await gateway1.refresh()
    await gateway2.refresh()

    response.assert.equal(gateway1.priority, 2)
    response.assert.equal(gateway2.priority, 1)
  })
})
