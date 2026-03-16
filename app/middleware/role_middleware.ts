import type { HttpContext } from '@adonisjs/core/http'
import type { NextFn } from '@adonisjs/core/types/http'
// eslint-disable-next-line @typescript-eslint/consistent-type-imports
import { Roles } from '#models/user'

export default class RoleMiddleware {
  public async handle(ctx: HttpContext, next: NextFn, allowedRoles: Roles[]) {
    const user = ctx.auth.user

    if (!user) {
      return ctx.response.unauthorized({ message: 'Usuário não autenticado' })
    }

    if (!allowedRoles.includes(user.role)) {
      return ctx.response.forbidden({
        message: 'Acesso negado: Você não tem permissão para realizar esta ação.',
      })
    }

    await next()
  }
}
