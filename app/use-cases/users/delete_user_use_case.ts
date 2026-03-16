import { inject } from '@adonisjs/core'
import User from '#models/user'

@inject()
export default class DeleteUserUseCase {
  public async execute(id: string) {
    const user = await User.findOrFail(id)
    await user.delete()
  }
}
