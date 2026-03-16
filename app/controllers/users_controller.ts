import type { HttpContext } from '@adonisjs/core/http'
import { inject } from '@adonisjs/core'

import { updateUserValidator } from '#validators/user_validator'
import ListUsersUseCase from '../use-cases/users/list_users_use_case.ts'
import UpdateUserUseCase from '../use-cases/users/update_user_use_case.ts'
import DeleteUserUseCase from '../use-cases/users/delete_user_use_case.ts'

@inject()
export default class UsersController {
  constructor(
    private readonly listUsersUseCase: ListUsersUseCase,
    private readonly updateUserUseCase: UpdateUserUseCase,
    private readonly deleteUserUseCase: DeleteUserUseCase
  ) {}

  public async index({ response }: HttpContext) {
    const users = await this.listUsersUseCase.execute()
    return response.ok(users)
  }

  public async update({ request, params, response }: HttpContext) {
    const payload = await request.validateUsing(updateUserValidator)

    const user = await this.updateUserUseCase.execute({
      id: params.id,
      role: payload.role as any,
    })

    return response.ok({ message: 'Papel do usuário atualizado com sucesso', user })
  }

  public async destroy({ params, response }: HttpContext) {
    await this.deleteUserUseCase.execute(params.id)

    return response.ok({ message: 'Usuário removido com sucesso' })
  }
}
