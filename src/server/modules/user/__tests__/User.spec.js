/*eslint-disable no-unused-vars*/
import "~/common/codeModChai";
import { getApollo } from "../../../testHelpers/integrationSetup";
import { login, logout } from "../testHelpers";

import { USER_QUERY, CURRENT_USER } from "~/client/gql.js";

const step = it,
	before = beforeAll,
	after = afterAll;

describe.skip("User API works", () => {
	let apollo;

	beforeAll(() => {
		apollo = getApollo();
	});

	step("User not logged in initially", async () => {
		const result = await apollo.query({ query: CURRENT_USER });
		expect(result.data).toEqual({ currentUser: null });
	});

	step("Siging in as ordinary user works", async () => {
		await login("user", "user1234");
		const result = await apollo.query({ query: CURRENT_USER });
		expect(result.data.currentUser.username).toEqual("user");
	});

	step("Signing out as ordinary user works", async () => {
		await logout();
		const result = await apollo.query({ query: CURRENT_USER });
		expect(result.data).toEqual({ currentUser: null });
	});

	step("Can't query user profiles as guest", async (done) => {
		apollo
			.query({ query: USER_QUERY, variables: { id: 1 } })
			.then(() => done("This test is expected to throw an error"))
			.catch((ex) => {
				// Check for values in the thrown graphQL error object here
				// e.g. message, extensions.code or other
				expect(ex.graphQLErrors[0]).toHaveProperty(
					["extensions", "code"],
					"UNAUTHENTICATED"
				);
				// Error received as expected, consider test as done
				done();
			})
			.catch(done);
	});

	describe.skip("Tests with authenticated user", () => {
		beforeAll(async () => {
			await login("asdf", "asdf");
		});
		afterAll(async () => {
			await logout();
		});

		step("Can query own user profile", async () => {
			const result = await apollo.query({
				query: USER_QUERY,
				variables: { id: 2 }
			});
			expect(result.data.user.user.username).toBe("user");
		});

		step("Cannot query other users profile", async () => {
			const result = await apollo.query({
				query: USER_QUERY,
				variables: { id: 1 }
			});
			expect(result.data.user.user).toBeNull();
		});
	});

	describe.skip("Tests with authenticated admin", () => {
		beforeAll(async () => {
			await login("admin", "admin123");
		});
		afterAll(async () => {
			await logout();
		});

		step("Can query own user profile", async () => {
			const result = await apollo.query({
				query: USER_QUERY,
				variables: { id: 1 }
			});
			expect(result.data.user.user.username).toBe("admin");
		});

		step("Can query other users profile", async () => {
			const result = await apollo.query({
				query: USER_QUERY,
				variables: { id: 2 }
			});
			expect(result.data.user.user.username).toBe("user");
		});
	});
});
