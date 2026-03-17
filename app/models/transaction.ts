import { DateTime } from 'luxon'
import { randomUUID } from 'node:crypto'
import { BaseModel, beforeCreate, belongsTo, column } from '@adonisjs/lucid/orm'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'

import User from './user.js'
import Gateway from './gateway.js'

export enum TransactionStatus {
  PAID = 'PAID',
  REFUNDED = 'REFUNDED',
  FAILED = 'FAILED',
}

export default class Transaction extends BaseModel {
  @column({ isPrimary: true })
  declare id: string

  @column()
  declare userId: string

  @column()
  declare gatewayId: string

  @column()
  declare gatewayTransactionId: string | null

  @column()
  declare amount: number

  @column()
  declare status: TransactionStatus

  @column()
  declare cardLastDigits: string

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime

  @belongsTo(() => User)
  declare user: BelongsTo<typeof User>

  @belongsTo(() => Gateway)
  declare gateway: BelongsTo<typeof Gateway>

  @beforeCreate()
  public static assignUuid(transaction: Transaction) {
    if (!transaction.id) {
      transaction.id = randomUUID()
    }
  }
}
