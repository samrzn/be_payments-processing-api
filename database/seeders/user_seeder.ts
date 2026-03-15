import { BaseSeeder } from '@adonisjs/lucid/seeders'
import User, { Roles } from '#models/user'

export default class extends BaseSeeder {
  public async run() {
    console.log('Populando o banco com o usuário ADMIN padrão...')

    await User.updateOrCreate(
      { email: 'admin@be.tech' },
      {
        password: 'password123',
        role: Roles.ADMIN,
      }
    )

    console.log('Usuário "admin@be.tech" criado com sucesso!')
  }
}
