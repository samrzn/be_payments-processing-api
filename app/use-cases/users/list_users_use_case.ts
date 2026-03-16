import { inject } from '@adonisjs/core'
import User from '#models/user'

@inject()
export default class ListUsersUseCase {
  public async execute() {
    return await User.query()
      .select('id', 'email', 'role', 'created_at', 'updated_at')
      .orderBy('created_at', 'desc')
  }
}
