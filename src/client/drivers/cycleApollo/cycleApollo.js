import xs from "xstream";
// import { adapt } from "@cycle/run/lib/adapt";

const responseFilter = (category) => (response$) => {
	var i = response$.options;
	return (
		response$.options &&
		(i.category === category || i.operationName === category)
	);
};

// changelog
// category alias to cat
// callbacks to client
// subscriptions add
// select by operation name
// observer and original object added into response, while first data entry got remapped under result
// returns flattened results
const producer = (observable) => {
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
		return response$;
	}

	return function apolloDriver(input$) {
		input$ = input$.map((x) => {
			if (x.cat) {
				x.category = x.cat;
				delete x.cat;
			}
			return x;
		});

		const queryResponse$ = input$
			.filter(input => input.query && !input.subscription)
			.map(apolloObserver);

		const mutation$ = input$
			.filter((input) => input.mutation)
			.map((options) => {
				const response$ = xs.from(client.mutate(options));
				response$.options = appendGraphOperationNameToOptions(options);
				return response$;
			});

		const subscription$ = input$
			.filter(input => input.subscription)
			.map(apolloObserver);

		const clientOperations$ = input$
			.filter((input) => input.op)
			.map((x) => {
				var res = x.op(client);
				var res$ = res instanceof xs ? res : xs.of(res ? res : null);
				res$.options = x;
				return res$;
			});

		const response$$ = xs.merge(
			queryResponse$,
			mutation$,
			subscription$,
			clientOperations$
		);

		response$$.subscribe({});

		const select = (category) => {
			var a = category
				? response$$.filter(responseFilter(category)).flatten()
				: response$$;
			return a;
		};

		Object.assign(response$$, { client }, { select });

		return response$$;
	};
}
