import xs from 'xstream'

const responseFilter = category => response$ => {
  // console.log(response$.options, "optionsss")
  return response$.options && (response$.options.category === category || response$.options.operationName === category)

}

const producer = observable => {
  let subscription
  return {
    start(listener) {
      subscription = observable.subscribe({
        next(val) {
          listener.next(val)
        }
      })
    },
    stop() {
      subscription.unsubscribe()
    }
  }
}

// const createApolloStore = client =>
//   createStore(
//     combineReducers({ apollo: client.reducer() }),
//     {},
//     applyMiddleware(client.middleware())
//   )

// function apolloObserver(options) {
//   const observer = options.subscription? client.subscribe(options) : client.watchQuery(options)
//   const response$ = xs.create(producer(observer))
//     .map(results => {
//       const key = Object.keys(results.data)[0]
//       return Object.assign(results, {results: results.data[key]}, {observer})
//     })
//   response$.options = options
//   return response$
// }

function appendGraphOperationNameToOptions (options) {
  var operationType = Object.keys(options).filter(x => x == "query" || x == "subscription" || x == "mutation")[0]
  var operationNameField = options[operationType].definitions[0].name
  var operationName = operationNameField ? operationNameField.value : false
  //options contains definitions for graphql operation, thus overwrite instead of shallow clone
  return Object.assign(options, { operationName: operationName })
}

export function makeApolloDriver(client) {
  // const store = createApolloStore(client)
  // client.setStore(store)

  //inner stream of {results as first data prop, observer, first operation name, and original object}
  function apolloObserver(options) {
    const observer = options.subscription ? client.subscribe(options) : client.watchQuery(options)
    const response$ = xs.create(producer(observer))
      .map(results => {
        const key = Object.keys(results.data)[0]
        return Object.assign(results, { result: results.data[key] }, { observer: observer })
      })
    response$.options = appendGraphOperationNameToOptions(options)
    // console.log(options, response$.options)
  return response$
  }

  return function apolloDriver(input$) {
    const queryResponse$$ = input$
      .filter(input => input.query && !input.subscription)
      .map(apolloObserver)

    const mutation$ = input$
      .filter(input => input.mutation)
      .map(options => {
        const response$ = xs.from(client.mutate(options))
        response$.options = appendGraphOperationNameToOptions(options)
        return response$
      })

    const subscription$ = input$
      .filter(input => input.subscription)
      .map(apolloObserver)



    const response$$ = xs.merge(queryResponse$$, mutation$, subscription$)

    response$$.subscribe({})

    response$$.select = (category) => {
      return category ?
        response$$.filter(responseFilter(category)) :
        response$$
    }

    response$$.client = client


    return response$$
  }
}
