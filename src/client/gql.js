//USERS
import AddUser from "./user/graphql/AddUser.graphql";
import CurrentUserQuery from "./user/graphql/CurrentUserQuery.graphql";
import DeleteUser from "./user/graphql/DeleteUser.graphql";
import EditUser from "./user/graphql/EditUser.graphql";
import ForgotPassword from "./user/graphql/ForgotPassword.graphql";
import Login from "./user/graphql/Login.graphql";
import Profile from "./user/graphql/Profile.graphql";
import Register from "./user/graphql/Register.graphql";
import ResetPassword from "./user/graphql/ResetPassword.graphql";
// import UPDATEFILTER from './user/graphql/UpdateFilter.client.graphql';
// import UPDATEORDERBY from './user/graphql/UpdateOrderby.client.graphql';
import User from "./user/graphql/User.graphql";
import UserQuery from "./user/graphql/UserQuery.graphql";
import UsersQuery from "./user/graphql/UsersQuery.graphql";
// import USERSSTATE from './user/graphql/UsersState.client.graphql';
// import USERSSTATEQUERY from './user/graphql/UsersStateQuery.client.graphql';
import UsersSubscription from "./user/graphql/UsersSubscription.graphql";

//COUNTER
import AddServerCounter from "./graphql/counter/AddCounter.graphql";

import gql from "graphql-tag";
//IMPORTANT//IMPOTANT/IMPORTANT//IMPOTANT/IMPORTANT//IMPOTANT/IMPORTANT//IMPOTANT
// TO SEE CHANGES REFLECTED FROM WITHIN .grpahql files, you have to modify this fail for cache to be invalidated
//IMPORTANT//IMPOTANT/IMPORTANT//IMPOTANT/IMPORTANT//IMPOTANT/IMPORTANT//IMPOTANT

var UserProfiled = `${User}${Profile}`;
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
`;

// export const login = gql`${LOGIN}${UserProfiled}`

export const COUNTER = Counter,
	// // USERS
	LOGIN = gql`
		${Login}
		${UserProfiled}
	`,
	CURRENT_USER = gql`
		${CurrentUserQuery}
		${UserProfiled}
	`,
	REGISTER = gql`
		${Register}
		${UserProfiled}
	`,
	RESET_PASSWORD = gql`
		${ResetPassword}
	`,
	ADD_USER = gql`
		${AddUser}
		${UserProfiled}
	`,
	DELETE_USER = gql`
		${DeleteUser}
	`,
	EDIT_USER = gql`
		${EditUser}
		${UserProfiled}
	`,
	FORGOT_PASSWORD = gql`
		${ForgotPassword}
	`,
	// updateFilter = gql`${UPDATEFILTER}${USERSSTATE}`,
	// updateOrderBy = gql`${UPDATEORDERBY}${USERSSTATE}`,
	USER_QUERY = gql`
		${UserQuery}
		${UserProfiled}
	`,
	USERS_QUERY = gql`
		${UsersQuery}
		${UserProfiled}
	`,
	// usersStateQuery = gql`${USERSSTATE}${USERSSTATEQUERY}`,
	USERS_SUBSCRIPTION = gql`
		${UsersSubscription}
		${UserProfiled}
	`,
	// // COUNTER
	ADD_SERVER_COUNTER = gql`
		${AddServerCounter}
	`;
export { LOGOUT };
