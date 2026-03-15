import type { HttpContext } from '@adonisjs/core/http'
import User from '#models/user'
import hash from '@adonisjs/core/services/hash'

export default class AuthController {
  public async login({ request, response }: HttpContext) {
    const { email, password } = request.only(['email', 'password'])
    const user = await User.findBy('email', email)

    if (!user) {
      return response.unauthorized({ message: 'Usuário inválido, e-mail não cadastrado' })
    }

    const isPasswordValid = await hash.verify(user.password, password)

    if (!isPasswordValid) {
      return response.unauthorized({ message: 'Senha incorreta.' })
    }

    const token = await User.accessTokens.create(user)

    return response.ok({
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
      },
      token: token.value!.release(),
    })
  }
}
