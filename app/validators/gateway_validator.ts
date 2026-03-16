import vine from '@vinejs/vine'

export const toggleGatewayValidator = vine.create(
  vine.object({
    is_active: vine.boolean(),
  })
)

export const updatePriorityValidator = vine.create(
  vine.object({
    gateways: vine
      .array(
        vine.object({
          id: vine.string().uuid(),

          priority: vine.number().withoutDecimals().min(1),
        })
      )
      .minLength(1),
  })
)
