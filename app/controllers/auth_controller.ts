import type { HttpContext } from '@adonisjs/core/http'
import { inject } from '@adonisjs/core'
import { loginValidator, signupValidator } from '../validators/user_validator.ts'
import LoginUseCase from '../use-cases/auth/login_use_case.ts'
import SignupUseCase from '../use-cases/auth/signup_use_case.ts'

@inject()
export default class AuthController {
  constructor(
    private readonly loginUseCase: LoginUseCase,
    private readonly signupUseCase: SignupUseCase
  ) {}

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

  public async signup({ request, response }: HttpContext) {
    const payload = await request.validateUsing(signupValidator)

    const result = await this.signupUseCase.execute({
      email: payload.email,
      passwordPlain: payload.password,
    })

    return response.created(result)
  }
}
