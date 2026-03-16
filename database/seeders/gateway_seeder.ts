import { BaseSeeder } from '@adonisjs/lucid/seeders'
import Gateway from '#models/gateway'

export default class extends BaseSeeder {
  public async run() {
    console.log('Populando o banco com os Gateways padrão...')

    await Gateway.updateOrCreate(
      { name: 'Gateway 1' },
      {
        isActive: true,
        priority: 1,
      }
    )

    await Gateway.updateOrCreate(
      { name: 'Gateway 2' },
      {
        isActive: true,
        priority: 2,
      }
    )

    console.log('Gateways 1 e 2 configurados com sucesso no banco de dados!')
  }
}
