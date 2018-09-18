import {run} from '@cycle/run';
import {makeDOMDriver} from '@cycle/dom';
import storageDriver from '@cycle/storage';
import {captureClicks, makeHistoryDriver} from '@cycle/history'
import onionify from 'cycle-onionify';
import storageify from "cycle-storageify";
import Layout from './components/_Layout/index.jsx';
import switchPath from 'switch-path';
import {routerify} from 'cyclic-router';
import { createHistory } from '@cycle/history'
import { makeRouterDriver } from 'cyclic-router'
import Cookies from 'universal-cookie';
import createApolloClient from '/../common/createApolloClient';
import { apiUrl } from './net';
// import modules from './modules/index';
import link from './modules/user/access/index'

// cycle-graphql-driver exports gql
import gql from 'graphql-tag';  

//USERS
import ADDUSER from './user/graphql/AddUser.graphql'; 
import CURRENTUSERQUERY from './user/graphql/CurrentUserQuery.graphql'; 
import DELETEUSER from './user/graphql/DeleteUser.graphql'; 
import EDITUSER from './user/graphql/EditUser.graphql'; 
import FORGOTPASSWORD from './user/graphql/ForgotPassword.graphql'; 
import LOGIN from './user/graphql/Login.graphql'; 
import PROFILE from './user/graphql/Profile.graphql'; 
import REGISTER from './user/graphql/Register.graphql'; 
import RESETPASSWORD from './user/graphql/ResetPassword.graphql'; 
import UPDATEFILTER from './user/graphql/UpdateFilter.client.graphql'; 
import UPDATEORDERBY from './user/graphql/UpdateOrderby.client.graphql'; 
import USER from './user/graphql/User.graphql'; 
import USERQUERY from './user/graphql/UserQuery.graphql'; 
import USERSQUERY from './user/graphql/UsersQuery.graphql'; 
import USERSSTATE from './user/graphql/UsersState.client.graphql'; 
import USERSSTATEQUERY from './user/graphql/UsersStateQuery.client.graphql'; 
import USERSSUBSCRIPTION from './user/graphql/UsersSubscription.graphql'; 


 
// import {makeApolloDriver} from './cycleApollo.js'
// import {makeGraphQLDriver} from 'cycle-graphql-driver'
import makeApolloDriver from './cycleApolloAcc'

var USERPROFILED = `${USER}${PROFILE}`
const LOGOUT = gql`
  mutation logout {
    logout
  }
`
var COUNTER = gql`
query serverCounterQuery { 
  serverCounter {
    amount
  }
}
`

// const client = createApolloClient({
//   apiUrl,
//   links: modules.link,
//   connectionParams: modules.connectionParams,
//   clientResolvers: modules.resolvers
// });
const client = createApolloClient({
  apiUrl, 
  links: link,
  // connectionParams: modules.connectionParams,
  // clientResolvers: modules.resolvers
});


// // console.log(LOGIN)
// // client.query({query: query, errorPolicy: "all"}).then(x=>console.log("test", x))//.catch(x=>console.log('err', x))
// client.mutate({mutation: gql`${LOGIN}${USERPROFILED}`, variables: {input: {usernameOrEmail: "asdf", password: "asdf"}}}).then(x=>console.log(x)).then(()=>{
//   client.query({query: gql`${CURRENTUSERQUERY}${USERPROFILED}`}).then(x=>console.log("current", x))
// })


const main = onionify(Layout);

run(main, {
  DOM: makeDOMDriver('#app'),
  history: captureClicks(makeHistoryDriver()),
  apollo: makeApolloDriver({client,
    templates: {
      count: COUNTER,
      // // USERS
      login: gql`${LOGIN}${USERPROFILED}`,
      currentUser: gql`${CURRENTUSERQUERY}${USERPROFILED}`,
      logout: LOGOUT,
      register: gql`${REGISTER}${USERPROFILED}`,
      resetPassword: gql`${RESETPASSWORD}`,
      addUser: gql`${ADDUSER}${USERPROFILED}`,
      deleteUser: gql`${DELETEUSER}`,
      editUser: gql`${EDITUSER}${USERPROFILED}`,
      forgotPassword: gql`${FORGOTPASSWORD}`,
      // updateFilter: gql`${UPDATEFILTER}${USERSSTATE}`,
      // updateOrderBy: gql`${UPDATEORDERBY}${USERSSTATE}`,
      userQuery: gql`${USERQUERY}${USERPROFILED}`,
      // usersStateQuery: gql`${USERSSTATE}${USERSSTATEQUERY}`,
      usersSubscription: gql`${USERSSUBSCRIPTION}${USERPROFILED}`,
    }
  })
  // storage: storageDriver,
}); 

// if('serviceWorker' in navigator) {
//   navigator.serviceWorker
//            .register('/sw.js')
//            .then(function() { console.log('Service Worker Registered'); })
//            .catch(err=>console.log(err));
// } 