import { getApollo } from '../../../testHelpers/integrationSetup';

// import LOGIN from '../../../../../client/src/modules/user/graphql/Login.graphql';
// import LOGOUT from '../../../../../client/src/modules/user/access/session/graphql/Logout.graphql';
import LOGIN from '../../../../../client/user/graphql/Login.graphql';
import LOGOUT from '../../../../../client/user/access/session/graphql/Logout.graphql';
console.log('RUNNING CLIENT STUFF');
export const login = async (usernameOrEmail = 'admin', password = 'admin123') =>
	await getApollo().mutate({
		mutation: LOGIN,
		variables: { input: { usernameOrEmail, password } }
	});

export const logout = async () => await getApollo().mutate({ mutation: LOGOUT });
