import { inject } from '@adonisjs/core'
import User, { Roles } from '#models/user'

interface UpdateUserDTO {
  id: string
  role: Roles
}

@inject()
export default class UpdateUserUseCase {
  public async execute({ id, role }: UpdateUserDTO) {
    const user = await User.findOrFail(id)

    user.role = role
    await user.save()

    return {
      id: user.id,
      email: user.email,
      role: user.role,
    }
  }
}
