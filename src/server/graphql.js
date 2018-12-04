import { ApolloServer, AuthenticationError } from "apollo-server-express";
import { formatResponse } from "apollo-logger";
import "isomorphic-fetch";

import modules from "./modules/index";
import schema from "./api/schema";
import log from "../common/log";

const mocks = {
	Int: () => 15,
	Float: () => 22.1,
	String: () => "Hello World"
};

export default () => {
	return new ApolloServer({
		schema,
		context: async ({ req, res }) => ({
			...(await modules.createContext(req, res)),
			req,
			res
		}),
		formatError: (error) => {
			return error.message === "Not Authenticated!"
				? new AuthenticationError(error)
				: error;
		},
		formatResponse: (response, options) =>
			config.app.logging.apolloLogging
				? formatResponse(
					{ logger: log.debug.bind(log) },
					response,
					options
				  )
				: response,
		tracing: !!config.engine.apiKey,
		cacheControl: !!config.engine.apiKey,
		engine: config.engine.apiKey
			? {
					apiKey: config.engine.apiKey
			  }
			: false,
		playground: {
			tabs: [
				{
					endpoint: "/graphql",
					query:
						"{\n" +
						"  serverCounter {\n" +
						"    amount\n" +
						"  }\n" +
						"}"
				}
			]
		},
		mocks,
		mockEntireSchema: false
	});
};
