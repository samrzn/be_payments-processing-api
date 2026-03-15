import type { HttpContext } from '@adonisjs/core/http'
import { inject } from '@adonisjs/core'
import { loginValidator } from '../validators/user.ts'
import LoginUseCase from '../use-cases/auth/login_use_case.ts'

@inject()
export default class AuthController {
  constructor(private readonly loginUseCase: LoginUseCase) {}

  public async login({ request, response }: HttpContext) {
    const payload = await request.validateUsing(loginValidator)

    try {
      const result = await this.loginUseCase.execute({
        email: payload.email,
        passwordPlain: payload.password,
      })

      return response.ok(result)
    } catch (error) {
      return response.unauthorized({ message: error.message })
    }
  }
}
