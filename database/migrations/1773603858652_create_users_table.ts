import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'users'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.uuid('id').primary()

      table.string('email', 255).notNullable().unique()

      table.string('password', 180).notNullable()

      table.enum('role', ['ADMIN', 'MANAGER', 'FINANCE', 'USER']).notNullable().defaultTo('USER')

      table.timestamp('created_at')
      table.timestamp('updated_at')
    })
  }

  public async down() {
    this.schema.dropTable(this.tableName)
  }
}
