import vine from '@vinejs/vine'

export const createProductValidator = vine.create(
  vine.object({
    name: vine.string().trim().minLength(2),
    amount: vine.number().withoutDecimals().min(1),
  })
)
