import User, { Roles } from '#models/user'
import { inject } from '@adonisjs/core'

interface SignupDTO {
  email: string
  passwordPlain: string
}

@inject()
export default class SignupUseCase {
  public async execute({ email, passwordPlain }: SignupDTO) {
    const user = await User.create({
      email,
      password: passwordPlain,
      role: Roles.USER,
    })

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
