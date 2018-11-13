import schema from './schema';
import resolvers from './resolvers';
import Feature from '../connector';
import config from 'config';

export default new Feature(
	config.user.auth.password.enabled
		? {
			schema,
			createResolversFunc: resolvers
		}
		: {}
);
 