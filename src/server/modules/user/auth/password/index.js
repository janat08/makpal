import schema from './schema';
import resolvers from './resolvers';
import Feature from '../connector';
const {config} = global

export default new Feature(
	config.user.auth.password.enabled
		? {
			schema,
			createResolversFunc: resolvers
		}
		: {}
);
 