import {
	makeApolloDriver,
	appendGraphOperationNameToOptions
} from './cycleApollo.js';
import { setup, run } from '@cycle/run';
import runRxjs from '@cycle/rxjs-run';
import xs, { Stream } from 'xstream';
import { setAdapt } from '@cycle/run/lib/adapt';

import { makeExecutableSchema, addMockFunctionsToSchema } from 'graphql-tools';
import { graphql } from 'graphql';
import schemaString from './schemaTest.js';
import { ApolloClient } from 'apollo-client';
import { InMemoryCache } from 'apollo-cache-inmemory';
import { SchemaLink } from 'apollo-link-schema';
import gql from 'graphql-tag';
import { adapt } from '@cycle/run/lib/adapt';

//remember test
import { Observable, of, never, interval, empty } from 'rxjs';
import {
	map,
	mergeMap,
	switchMap,
	publishReplay,
	refCount,
	take,
	delay,
	mergeAll
} from 'rxjs/operators';

let dispose = () => {};
var client: any = {};

const HERO = gql`
	query getHero {
		hero {
			name
		}
	}
`;

interface hero {
	data: {
		hero: {
			name: 'Hello World';
		};
	};
}
function heroTest(x: hero, custom?: string) {
	expect(x).toMatchObject({
		data: {
			hero: {
				name: custom || 'Hello World'
			}
		}
	});
}

const REVIEWEPISODE = gql`
	mutation CreateReviewForEpisode($ep: Episode!, $review: ReviewInput!) {
		createReview(episode: $ep, review: $review) {
			episode
			stars
			commentary
		}
	}
`;

const reviewEpisodeVars = {
	ep: 'JEDI',
	review: {
		stars: 5,
		commentary: 'This is a great movie!'
	}
};

function reviewTest(x) {
	expect(x).toMatchObject({
		data: {
			createReview: {
				episode: 'EMPIRE',
				commentary: 'Hello World'
			}
		}
	});
}

describe('apolloDriver', function() {
	beforeAll(() => {
		// Make a GraphQL schema with no resolvers
		// import { mockServer, MockList } from 'graphql-tools';
		//lightweight variant requiring custom definitions to deterministic results
		const schema = makeExecutableSchema({
			typeDefs: schemaString,
			resolverValidationOptions: { requireResolversForResolveType: false }
		});
		// Add mocks, modifies schema in place
		const mocks = {
			Int: () => 6,
			Float: () => 22.1,
			String: () => 'Hello World'
		};
		addMockFunctionsToSchema({ schema, mocks });
		const apolloCache = new InMemoryCache((window as any).__APOLLO_STATE__);
		// @ts-ignore
		client = new ApolloClient({
			// @ts-ignore
			cache: apolloCache,
			// @ts-ignore
			link: new SchemaLink({ schema })
		});
	});
	beforeEach(async function() {
		setAdapt((x) => x);
		await client.resetStore();
	});
	afterEach(function() {
		dispose();
	});
	it('will filter queries with select()', (done) => {
		function main(sources) {
			sources.apollo.select('category').subscribe({
				next(result) {
					heroTest(result);
					done();
				},
				error: done.fail,
				complete: () => done.fail('completed')
			});
			return {
				apollo: xs.of({
					query: HERO,
					category: 'category'
				})
			};
		}

		dispose = run(main, { apollo: makeApolloDriver(client) });
	});
	it('will select by name given to operation in gql string', (done) => {
		function main(sources) {
			sources.apollo.select('getHero').subscribe({
				next(result) {
					heroTest(result);
					done();
				},
				error: done.fail,
				complete: () => done.fail('completed')
			});
			return {
				apollo: xs.of({
					query: HERO,
					category: 'asdf'
				})
			};
		}

		dispose = run(main, { apollo: makeApolloDriver(client) });
	});
	it('will throw error if no category or operation name given within gql string in template or runtime, select can\'t occur', () => {
		expect(() =>
			appendGraphOperationNameToOptions({
				query: gql`
					query {
						hero {
							name
						}
					}
				`
			})
		).toThrow(
			'Neither category, nor operation name has been defined, so .select() won\'t trigger. Perhaps something went wrong'
		);
	});
	it.skip('will accept async operations to be performed on client', (done) => {
		function main(sources) {
			var query$ = xs.of({
				query: HERO,
				category: 'asdf'
			});

			var manipulate$ = xs.of({
				cat: 'wQ',
				op: async function(client) {
					var param = {
						query: HERO,
						data: { hero: { __typename: 'Human', name: 'asdff' } }
					};
					var a = await client.writeQuery(param);
					return null;
				}
			});

			var then$ = sources.apollo
				.select('wQ')
				.mapTo(query$)
				.flatten();

			sources.apollo.select('asdf').subscribe({
				next(result) {
					console.log(
						111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111,
						result
					);
					heroTest(result, 'asdff');
					done();
				},
				error: done.fail,
				complete: () => done.fail('completed')
			});

			return {
				apollo: xs.merge(manipulate$, then$)
			};
		}

		dispose = run(main, { apollo: makeApolloDriver(client) });
	}, 9000);
	it.skip('adapt works', function(done) {
		function main(_sources: any) {
			of(1);
			expect(_sources.apollo.select()).toHaveProperty(null);

			return {};
		}

		var select = () => {
			return adapt(xs.of('asdf'));
		};

		dispose = runRxjs(main, {
			apollo: () => {
				return { select };
			}
		});
	});
	it.skip('will rerun watchQuery after storeReset with empty results', () => {
		expect(true).toBe(true);
	});
	//coppied from http driver on cyclejs repository
	it.skip('should not remember past responses when selecting', function(done) {
		function main(_sources: any) {
			const test$ = of(null).pipe(
				delay(1000),
				mergeMap(() =>
					_sources.apollo.select('cat').pipe(
						mergeAll(),
						map((res: any) => 'I should not show this, ' + res.text)
					)
				)
			);

			const request$ = of({
				category: 'cat',
				query: HERO
			});

			return {
				apollo: request$,
				Test: test$
			};
		}

		function testDriver(sink: any) {
			sink.addListener({
				next: (s: any) => {
					console.log(s);
					done.fail('No data should come through the Test sink');
				},
				error: (err: any) => {
					done(err);
				}
			});
		}

		dispose = runRxjs(main, {
			apollo: makeApolloDriver(client),
			Test: testDriver
		});

		setTimeout(() => {
			done();
		}, 2000);
	}, 4000); //from 277 on index.ts of http/test/browser
});
