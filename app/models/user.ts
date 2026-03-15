import { DateTime } from 'luxon'
import { randomUUID } from 'node:crypto'
import hash from '@adonisjs/core/services/hash'
import { BaseModel, beforeCreate, beforeSave, column } from '@adonisjs/lucid/orm'

export enum Roles {
  ADMIN = 'ADMIN',
  MANAGER = 'MANAGER',
  FINANCE = 'FINANCE',
  USER = 'USER',
}

export default class User extends BaseModel {
  @column({ isPrimary: true })
  declare id: string

  @column()
  declare email: string

  @column()
  declare password: string

  @column()
  declare role: Roles

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime

  @beforeCreate()
  public static assignUuid(user: User) {
    if (!user.id) {
      user.id = randomUUID()
    }
  }

  @beforeSave()
  public static async hashPassword(user: User) {
    if (user.$dirty.password) {
      user.password = await hash.make(user.password)
    }
  }
}
