import type { HttpContext } from '@adonisjs/core/http'
import vine from '@vinejs/vine'
import AuthService from '../services/auth_service.ts'

const loginValidator = vine.create(
  vine.object({
    email: vine.string().email(),
    password: vine.string(),
  })
)

export default class AuthController {
  public async login({ request, response }: HttpContext) {
    const payload = await request.validateUsing(loginValidator)

    try {
      const authService = new AuthService()
      const authResult = await authService.authenticate(payload.email, payload.password)

      return response.ok(authResult)
    } catch (error) {
      return response.status(error.status || 500).send({ message: error.message })
    }
  }
}
