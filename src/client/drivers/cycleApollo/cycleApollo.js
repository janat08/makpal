import xs from 'xstream';
import { adapt } from '@cycle/run/lib/adapt';

const responseFilter = category => response$ => {
	return (
		response$.options &&
		(response$.options.category === category ||
			response$.options.operationName === category)
	);
};

//changelog
//adapt/rxjs/most
//subscriptions add
// select by operation name
// observer and original object added into response, while first data entry got remapped under result
// returns flattened results under driver property derived from template option
const producer = observable => {
	let subscription;
	return {
		start(listener) {
			subscription = observable.subscribe({
				next(val) {
					listener.next(val);
				}
			});
		},
		stop() {
			subscription.unsubscribe();
		}
	};
};

export function appendGraphOperationNameToOptions(options) {
	var operationType = Object.keys(options).filter(
		x => x == 'query' || x == 'subscription' || x == 'mutation'
	)[0];
	var operationNameField = options[operationType].definitions[0].name;
	var operationName = operationNameField ? operationNameField.value : false;
	if (!options || (!options.category && !operationName)) {
		throw new Error(
			'Neither category, nor operation name has been defined, so .select() won\'t trigger. Perhaps something went wrong'
		);
	}
	return Object.assign(options, { operationName: operationName });
}

export function makeApolloDriver(client, template = []) {
	//inner stream of {results as first data prop, observer, first operation name, and original object}
	function apolloObserver(options) {
		const observer = options.subscription
			? client.subscribe(options)
			: client.watchQuery(options);
		const response$ = xs.create(producer(observer)).map(results => {
			const key = Object.keys(results.data)[0];
			return Object.assign(
				results,
				{ result: results.data[key] },
				{ observer: observer }
			);
		});
		response$.options = appendGraphOperationNameToOptions(options);
		return adapt(response$);
	}

	return function apolloDriver(input$) {
		const queryResponse$ = input$
			.filter(input => input.query && !input.subscription)
			.map(apolloObserver);

		const mutation$ = input$.filter(input => input.mutation).map(options => {
			const response$ = xs.from(client.mutate(options));
			response$.options = appendGraphOperationNameToOptions(options);
			return adapt(response$);
		});

		const subscription$ = input$
			.filter(input => input.subscription)
			.map(apolloObserver);

		const clientOperations$ = input$.filter(input => input.op).map(x => {
			
			return xs.from(client[x.op](x.param));
		});

		const response$$ = xs.merge(
			queryResponse$,
			mutation$,
			subscription$,
			clientOperations$
		);

		response$$.subscribe({});

		const select = category => {
			return category
				? adapt(response$$.filter(responseFilter(category)).flatten())
				: adapt(response$$);
		};

		Object.assign(response$$, { client }, { select });

		return adapt(response$$);
	};
}
