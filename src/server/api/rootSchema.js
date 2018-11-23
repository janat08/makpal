export default `type FieldError {
  field: String!
  message: String!
}

type Query {
  dummy: Int
  # Get all users ordered by: OrderByUserInput add filtered by: FilterUserInput
  users(orderBy: OrderByUserInput, filter: FilterUserInput): [User]
  # Get user by id
  user(id: Int!): UserPayload
  # Get current user
  currentUser: User
  serverCounter: Counter

}

type Mutation {
  dummy: Int
  refreshTokens(refreshToken: String!): Tokens!
  logout: String

  login(input: LoginUserInput!): AuthPayload!

  forgotPassword(input: ForgotPasswordInput!): String

  resetPassword(input: ResetPasswordInput!): ResetPayload!

  register(input: RegisterUserInput!): UserPayload!
  # Create new user
  addUser(input: AddUserInput!): UserPayload!
  # Edit a user
  editUser(input: EditUserInput!): UserPayload!
  # Delete a user
  deleteUser(id: Int!): UserPayload!
  addServerCounter(
    # Amount to add to counter
    amount: Int!
  ): Counter
}

type Subscription {
  usersUpdated(filter: FilterUserInput): UpdateUserPayload
  dummy: Int
  counterUpdated: Counter
}

schema {
  query: Query
  mutation: Mutation
  subscription: Subscription
}

type Counter {
  # Current amount
  amount: Int!
}

input LoginUserInput {
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

type User {
  id: Int!
  username: String!
  role: String!
  isActive: Boolean
  email: String!
  profile: UserProfile
  auth: UserAuth
}

type UserProfile {
  firstName: String
  lastName: String
  fullName: String
}

# Additional authentication service info
type UserAuth {
  certificate: CertificateAuth
  facebook: FacebookAuth
  google: GoogleAuth
  github: GithubAuth
  linkedin: LinkedInAuth
}

type CertificateAuth {
  serial: String
}

type FacebookAuth {
  fbId: String
  displayName: String
}

type GoogleAuth {
  googleId: String
  displayName: String
}

type GithubAuth {
  ghId: String
  displayName: String
}

type LinkedInAuth {
  lnId: String
  displayName: String
}

type UserPayload {
  user: User
  errors: [FieldError!]
}

# Input for ordering users
input OrderByUserInput {
  # id | username | role | isActive | email
  column: String
  # asc | desc
  order: String
}

# Input for filtering users
input FilterUserInput {
  # search by username or email
  searchText: String
  # filter by role
  role: String
  # filter by isActive
  isActive: Boolean
}

# Additional authentication service info
input AuthInput {
  certificate: AuthCertificateInput
  facebook: AuthFacebookInput
  google: AuthGoogleInput
  github: AuthGitHubInput
  linkedin: AuthLinkedInInput
}

input AuthCertificateInput {
  serial: String
}

input AuthFacebookInput {
  fbId: String
  displayName: String
}

input AuthGoogleInput {
  googleId: String
  displayName: String
}

input AuthGitHubInput {
  ghId: String
  displayName: String
}

input AuthLinkedInInput {
  lnId: String
  displayName: String
}

# Input for addUser Mutation
input AddUserInput {
  username: String!
  email: String!
  password: String!
  role: String!
  isActive: Boolean
  profile: ProfileInput
  auth: AuthInput
}

# Input for editUser Mutation
input EditUserInput {
  id: Int!
  username: String!
  role: String!
  isActive: Boolean
  email: String!
  password: String
  profile: ProfileInput
  auth: AuthInput
}

input ProfileInput {
  firstName: String
  lastName: String
}


# Payload for usersUpdated Subscription
type UpdateUserPayload {
  mutation: String!
  node: User!
}
`;
