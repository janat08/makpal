import { getApollo } from "../../../testHelpers/integrationSetup";

import { LOGIN, LOGOUT } from "~/client/gql.js";

export const login = async (usernameOrEmail = "admin", password = "admin123") =>
	await getApollo().mutate({
		mutation: LOGIN,
		variables: { input: { usernameOrEmail, password } }
	});

export const logout = async () =>
	await getApollo().mutate({ mutation: LOGOUT });
