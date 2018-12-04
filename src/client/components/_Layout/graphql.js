// counterQuery$.subscribe(ab)
// counterQuery2$.subscribe(ab)

// xs.merge(counterQuery2$, counterQuery$).addListener({
//   next: s => {console.log("new counted", s)},
//   complete: s => {console.log("counter done")}
// })

// var a = client.watchQuery({query: gql`${COUNTER}`, polling: 1000})
// a.subscribeToMore(function(x){console.log(x)})
// console.log("client", a)

// client.query({query: query, errorPolicy: "all"}).then(x=>console.log("test", x))//.catch(x=>console.log('err', x))
// client.mutate({mutation: gql`${LOGIN}${USERPROFILED}`, variables: {input: {usernameOrEmail: "asdf", password: "asdf"}}}).then(x=>console.log(x)).then(()=>{
// client.watchQuery({query: gql`${COUNTER}`}).then(x=>console.log("current", x))
// })

const query$ = xs.of({
	mutation: LOGIN,
	variables: { input: { usernameOrEmail: "asdf", password: "asdf" } },
	category: "allusers"
});

const counterUpdated$ = xs.of({
	subscription: true,
	query: gql`
		subscription onCounterUpdated {
			counterUpdated {
				amount
			}
		}
	`,
	category: "sub"
});

const counter$ = xs.of({
	query: COUNTER,
	category: "counter",
	pollingInterval: 500
});

var ab = {
	next: (s) => {
		console.log("new counted", s);
	},
	complete: (s) => {
		console.log("counter done");
	}
};

// const subscription$ = sources.apollo.select('sub')
//   .flatten()

// const response$ = sources.apollo.select('allusers')
//   .flatten()
//   // .startWith([])
// const counterQuery$ = sources.apollo.select('serverCounterQuery')
//   .flatten()

// const counterQuery2$ = sources.apollo.select('counter')
//   .flatten()

// let results$ = sources.apollo
// .flatMap(r$ => r$
//   .replaceError(err => xs.of({errors: [err.message]}))
// )
// .filter(({errors}) => {
//   if (errors && errors.length) {
//     console.log('errors:', errors)
//     return false
//   }
//   return true
// })
// .map(({data}) => data)

// let response$ = sources.apollo//.flatten()
//   .compose(flattenConcurrently)
//   .map((data) => data);

// subscription$.subscribe({
//   next: s => { console.log("new", new Date()/1000, s) },
//   error: err => console.error(err),
//   complete: () => {},
// });

// response$.addListener({
//   next: s => { console.log("user", new Date()/1000, s) },
//   error: err => console.error(err),
//   complete: () => {},
