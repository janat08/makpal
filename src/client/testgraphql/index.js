import ApolloClient from 'apollo-boost';
import query from './index.graphql';
const testClient = new ApolloClient({
	uri: 'http://localhost:5000/graphql'
});

testClient.query({
	query,
}).then((data) => {
	console.log('graphql import does work, check the imported graphql file');
	console.log('test graphql import, fetched dataasdf', data);
});


