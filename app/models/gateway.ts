// import { GatewaySchema } from '#database/schema'

import { DateTime } from 'luxon'
import { randomUUID } from 'node:crypto'
import { BaseModel, beforeCreate, column } from '@adonisjs/lucid/orm'

export default class Gateway extends BaseModel {
  @column({ isPrimary: true })
  declare id: string

  @column()
  declare name: string

  @column({
    columnName: 'is_active',
    consume: Boolean,
    prepare: (value: boolean) => (value ? 1 : 0),
  })
  declare isActive: boolean

  @column()
  declare priority: number

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime

  @beforeCreate()
  public static assignUuid(gateway: Gateway) {
    if (!gateway.id) {
      gateway.id = randomUUID()
    }
  }
}
