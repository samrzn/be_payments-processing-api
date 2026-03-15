import { test } from '@japa/runner'
import User, { Roles } from '#models/user'

test.group('Auth / Login', (group) => {
  group.each.setup(async () => {
    await User.query().delete()
    await User.create({
      email: 'test@be.tech',
      password: 'password123',
      role: Roles.USER,
    })
  })

  test('deve retornar 422 se os dados de entrada forem inválidos', async ({ client }) => {
    const response = await client.post('/api/login').json({
      email: 'email_invalido',
    })

    response.assertStatus(422)
  })

  test('deve retornar 401 se a senha estiver incorreta', async ({ client }) => {
    const response = await client.post('/api/login').json({
      email: 'test@be.tech',
      password: 'senha_errada_aqui',
    })

    response.assertStatus(401)
    response.assertBodyContains({ message: 'Credenciais inválidas' })
  })

  test('deve realizar o login com sucesso e retornar o token', async ({ client }) => {
    const response = await client.post('/api/login').json({
      email: 'test@be.tech',
      password: 'password123',
    })

    response.assertStatus(200)
    response.assertBodyContains({
      user: {
        email: 'test@be.tech',
        role: 'USER',
      },
    })

    response.assert.isString(response.body().token)
  })
})
