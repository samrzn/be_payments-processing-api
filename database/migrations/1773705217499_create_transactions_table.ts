import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'transactions'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.uuid('id').primary()
      table.uuid('user_id').references('id').inTable('users').onDelete('SET NULL')
      table.uuid('gateway_id').references('id').inTable('gateways').onDelete('SET NULL')
      table.string('gateway_transaction_id').nullable()
      table.integer('amount').notNullable()
      table.string('status').notNullable()
      table.string('card_last_digits', 4).notNullable()
      table.timestamp('created_at')
      table.timestamp('updated_at')
    })
  }

  public async down() {
    this.schema.dropTable(this.tableName)
  }
}
