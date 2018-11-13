
export default `
extend type Mutation {
  # Refresh user tokens
  refreshTokens(refreshToken: String!): Tokens!
}
`;