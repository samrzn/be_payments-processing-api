import vine from '@vinejs/vine'

const email = () => vine.string().email().maxLength(255)
const password = () => vine.string().minLength(8).maxLength(32)

export const signupValidator = vine.create({
  email: email().unique({ table: 'users', column: 'email' }),
  password: password(),
  passwordConfirmation: password().sameAs('password'),
})

export const loginValidator = vine.create(
  vine.object({
    email: vine.string().email(),
    password: vine.string(),
  })
)
