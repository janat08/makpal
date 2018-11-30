//USERS
import AddUser from './user/graphql/AddUser.graphql';
import CurrentUserQuery from './user/graphql/CurrentUserQuery.graphql';
import DeleteUser from './user/graphql/DeleteUser.graphql';
import EditUser from './user/graphql/EditUser.graphql';
import ForgotPassword from './user/graphql/ForgotPassword.graphql';
import Login from './user/graphql/Login.graphql';
import Profile from './user/graphql/Profile.graphql';
import Register from './user/graphql/Register.graphql';
import ResetPassword from './user/graphql/ResetPassword.graphql';
// import UPDATEFILTER from './user/graphql/UpdateFilter.client.graphql';
// import UPDATEORDERBY from './user/graphql/UpdateOrderby.client.graphql';
import User from './user/graphql/User.graphql';
import UserQuery from './user/graphql/UserQuery.graphql';
import UsersQuery from './user/graphql/UsersQuery.graphql';
// import USERSSTATE from './user/graphql/UsersState.client.graphql';
// import USERSSTATEQUERY from './user/graphql/UsersStateQuery.client.graphql';
import UsersSubscription from './user/graphql/UsersSubscription.graphql';

//COUNTER
import AddServerCounter from './graphql/counter/AddCounter.graphql';

import gql from 'graphql-tag';
//IMPORTANT//IMPOTANT/IMPORTANT//IMPOTANT/IMPORTANT//IMPOTANT/IMPORTANT//IMPOTANT
// TO SEE CHANGES REFLECTED FROM WITHIN .grpahql files, you have to modify this fail for cache to be invalidated
//IMPORTANT//IMPOTANT/IMPORTANT//IMPOTANT/IMPORTANT//IMPOTANT/IMPORTANT//IMPOTANT

var UserProfiled = gql`
	${User},
	${Profile}
`;
const LOGOUT = gql`
	mutation logout {
		logout
	}
`;
var Counter = gql`
	query serverCounterQuery {
		serverCounter {
			amount
		}
	}

	${Login}

	${LOGOUT}
`;

// export const login = gql`${LOGIN}${UserProfiled}`

// test graphql import
console.log('graphql import');
console.log('before test');
console.log(Counter);
console.log('after test');
console.log('import success');


console.log(`${Login}`);
console.log('before test');
export const test = gql`
	${Login}
	${LOGOUT}
`;
console.log(test);
console.log('after test');

export const COUNTER = Counter;
// // USERS
// there has syntax error, because Login is parsed graphql
console.log('counter',COUNTER);
export const LOGIN = gql`
		${Login}
	`;
console.log('login',LOGIN);
console.log(CurrentUserQuery);
console.log(UserProfiled);
export const CURRENTUSER = gql`
		${CurrentUserQuery}
		${UserProfiled}
	`;
console.log('current',CURRENTUSER);
export const	REGISTER = gql`
		${Register}
		${UserProfiled}
	`;
export const	RESETPASSWORD = gql`
		${ResetPassword}
	`;
export const	ADDUSER = gql`
		${AddUser}
		${UserProfiled}
	`;
export const	DELETEUSER = gql`
		${DeleteUser}
	`;
export const	EDITUSER = gql`
		${EditUser}
		${UserProfiled}
	`;
export const	FORGOTPASSWORD = gql`
		${ForgotPassword}
	`;
// updateFilter = gql`${UPDATEFILTER}${USERSSTATE}`,
// updateOrderBy = gql`${UPDATEORDERBY}${USERSSTATE}`,
export const	USERQUERY = gql`
		${UserQuery}
		${UserProfiled}
	`;
export const	USERSQUERY = gql`
		${UsersQuery}
		${UserProfiled}
	`;
// usersStateQuery = gql`${USERSSTATE}${USERSSTATEQUERY}`,
export const	USERSSUBSCRIPTION = gql`
		${UsersSubscription}
		${UserProfiled}
	`;
// // COUNTER
export const	ADDSERVERCOUNTER = gql`
		${AddServerCounter}
	`;
export { LOGOUT };
