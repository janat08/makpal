import WebSocket from "ws";

import createApolloClient from "~/common/createApolloClient";

let server;
let apollo;

beforeAll(async () => {
	server = await require("../server").default;

	global.WebSocket = WebSocket;
	apollo = createApolloClient({
		apiUrl: `http://localhost:${process.env["PORT"]}/graphql`
	});
});

afterAll(() => {
	if (server) {
		server.close();
		delete global.__TEST_SESSION__;
	}
});

export const getServer = () => server;
export const getApollo = () => apollo;
