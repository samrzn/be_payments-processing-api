import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  // Nome exato da tabela que será criada no MySQL
  protected tableName = 'gateways'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.uuid('id').primary()
      table.string('name').notNullable().unique()
      table.boolean('is_active').notNullable().defaultTo(true)
      table.integer('priority').notNullable()
      table.timestamp('created_at')
      table.timestamp('updated_at')
    })
  }

  public async down() {
    this.schema.dropTable(this.tableName)
  }
}
