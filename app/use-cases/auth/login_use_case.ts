import User from '#models/user'
import hash from '@adonisjs/core/services/hash'
import { Exception } from '@adonisjs/core/exceptions'

interface LoginDTO {
  email: string
  passwordPlain: string
}

export default class LoginUseCase {
  public async execute({ email, passwordPlain }: LoginDTO) {
    const user = await User.findBy('email', email)

    if (!user) {
      throw new Exception('Usuário inválido, e-mail não cadastrado', { status: 401 })
    }

    const isPasswordValid = await hash.verify(user.password, passwordPlain)

    if (!isPasswordValid) {
      throw new Exception('Senha incorreta', { status: 401 })
    }

    const token = await User.accessTokens.create(user)

    return {
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
      },
      token: token.value!.release(),
    }
  }
}
