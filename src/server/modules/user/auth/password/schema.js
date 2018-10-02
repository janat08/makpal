export default `input LoginUserInput {
  usernameOrEmail: String!
  password: String!
}

type Tokens {
  accessToken: String
  refreshToken: String
}

type AuthPayload {
  user: User
  tokens: Tokens
  errors: [FieldError!]
}

input RegisterUserInput {
  username: String!
  email: String!
  password: String!
}

input ForgotPasswordInput {
  email: String!
}

input ResetPasswordInput {
  token: String!
  password: String!
  passwordConfirmation: String!
}

type ResetPayload {
  errors: [FieldError!]
}

extend type Mutation {

  login(input: LoginUserInput!): AuthPayload!

  forgotPassword(input: ForgotPasswordInput!): String

  resetPassword(input: ResetPasswordInput!): ResetPayload!

  register(input: RegisterUserInput!): UserPayload!
}
`