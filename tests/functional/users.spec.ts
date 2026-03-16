import { test } from '@japa/runner'
import testUtils from '@adonisjs/core/services/test_utils'
import User, { Roles } from '#models/user'

test.group('Users', (group) => {
  let adminUser: User
  let managerUser: User
  let regularUser: User
  let targetUser: User

  group.each.setup(() => testUtils.db().wrapInGlobalTransaction())

  group.each.setup(async () => {
    adminUser = await User.create({
      email: 'admin_users@be.tech',
      password: 'password123',
      role: Roles.ADMIN,
    })

    managerUser = await User.create({
      email: 'manager_users@be.tech',
      password: 'password123',
      role: Roles.MANAGER,
    })

    regularUser = await User.create({
      email: 'regular_users@be.tech',
      password: 'password123',
      role: Roles.USER,
    })

    targetUser = await User.create({
      email: 'target_users@be.tech',
      password: 'password123',
      role: Roles.USER,
    })
  })

  test('deve retornar 401 se não estiver autenticado', async ({ client }) => {
    const response = await client.get('/api/users')

    response.assertStatus(401)
  })

  test('deve retornar 403 se um USER comum tentar listar usuários', async ({ client }) => {
    const response = await client.get('/api/users').loginAs(regularUser)

    response.assertStatus(403)
  })

  test('deve listar usuários para o ADMIN', async ({ client }) => {
    const response = await client.get('/api/users').loginAs(adminUser)

    response.assertStatus(200)
    response.assert.isArray(response.body())
    response.assert.lengthOf(response.body(), 4)
  })

  test('deve listar usuários para o MANAGER', async ({ client }) => {
    const response = await client.get('/api/users').loginAs(managerUser)

    response.assertStatus(200)
    response.assert.isArray(response.body())
    response.assert.lengthOf(response.body(), 4)
  })

  test('deve retornar 422 se o payload de update for inválido', async ({ client }) => {
    const response = await client.patch(`/api/users/${targetUser.id}`).loginAs(adminUser).json({
      role: 'ROLE_INEXISTENTE',
    })

    response.assertStatus(422)
  })

  test('deve atualizar o papel do usuário com sucesso', async ({ client }) => {
    const response = await client.patch(`/api/users/${targetUser.id}`).loginAs(adminUser).json({
      role: Roles.FINANCE,
    })

    response.assertStatus(200)
    response.assertBodyContains({
      message: 'Papel do usuário atualizado com sucesso',
    })

    await targetUser.refresh()
    response.assert.equal(targetUser.role, Roles.FINANCE)
  })

  test('deve remover um usuário com sucesso', async ({ client }) => {
    const response = await client.delete(`/api/users/${targetUser.id}`).loginAs(adminUser)

    response.assertStatus(200)
    response.assertBodyContains({
      message: 'Usuário removido com sucesso',
    })

    const deletedUser = await User.find(targetUser.id)
    response.assert.isNull(deletedUser)
  })
})
