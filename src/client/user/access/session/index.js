import Feature from '../connector';
import settings from '../../../../../../../settings';
// this module path may have error....
import LOGOUT from './graphql/Logout.graphql';

const logout = (client) => client.mutate({ mutation: LOGOUT });

export default new Feature(
	settings.user.auth.access.session.enabled
		? {
				logout
		  }
		: {}
);
