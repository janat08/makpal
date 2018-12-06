const express = require('express');
const { ApolloServer, gql } = require('apollo-server-express');

// Construct a schema, using GraphQL schema language
const typeDefs = gql`
  type Query {
    hello: String
    hello2: String
    hello3: String
    world: String
    world1:String
    world2: String
    world3: String
  }

`;

// Provide resolver functions for your schema fields
const resolvers = {
	Query: {
		hello: () => 'hello',
		hello2: () => 'hello2',
		hello3: () => 'hello3',
		world: () => 'world',
		world1: () => 'world1',
		world2: () => 'world2',
		world3: () => 'world3',
	},
};

const server = new ApolloServer({ typeDefs, resolvers });

const app = express();
server.applyMiddleware({ app });

app.listen({ port: 5000 });