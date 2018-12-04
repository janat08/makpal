import Counter from "./sql.ts";

// import schema from './schema.graphql';
import createResolvers from "./resolvers.ts";
import Feature from "../connector.ts";

export default new Feature({
	// schema,
	createResolversFunc: createResolvers,
	createContextFunc: () => ({ Counter: new Counter() })
});
