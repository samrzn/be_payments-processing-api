import vine from '@vinejs/vine'

export const signupValidator = vine.create(
  vine.object({
    email: vine
      .string()
      .email()
      .maxLength(255)
      .unique(async (db, value) => {
        const match = await db.from('users').select('id').where('email', value).first()
        return !match
      }),

    password: vine.string().minLength(8).maxLength(32),
  })
)

export const loginValidator = vine.create(
  vine.object({
    email: vine.string().email().maxLength(255),
    password: vine.string().minLength(8).maxLength(32),
  })
)
