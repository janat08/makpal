import access from './access';
import auth from './auth';
import confirmMiddleware from './confirm';
import schema from './schema';
import resolvers from './resolvers';
import scopes from './scopes';
const { config } = global;
import User from './sql';
import Feature from '../connector.ts';
import resources from './locales';

const createContextFunc = async ({ context: { user } }) => ({
	User,
	user,
	auth: {
		isAuthenticated: !!user,
		scope: user ? scopes[user.role] : null
	}
});

export default new Feature(access, auth, {
	schema,
	createResolversFunc: resolvers,
	createContextFunc,
	middleware: app => {
		if (config.user.auth.password.sendConfirmationEmail) {
			app.get('/confirmation/:token', confirmMiddleware);
		}
	},
	localization: { ns: 'user', resources }
});
