import bcrypt from 'bcryptjs';

function filterField(field, param) {
	return function (object) {
		if (Array.isArray(field)) {
			return field.reduce(function (a, x) {
				if (Array.isArray(param)) {
					a = param.reduce(function (ab, xb) {
						if (object[x] == xb) {
							ab = true;
						}
					}, false);
				} else {
					if (object[x] == param) {
						a = true;
					}
				}
				return a;
			}, false);
		} else {
			return object[field] == param;
		}
	};
}
// Actual query fetching and transformation in DB
class User {
	constructor() {
		this.users = [
			{
				id: '1234',
				username: 'asdf',
				role: 'asdf',
				isActive: true,
				email: 'asdf@asdf',
				first_name: 'asdf',
				last_name: 'asdf',
				serial: 'asdf',
				passwordHash: '$2a$12$GiTLGeMeaoFyzAJhQKPms.BgaGo.KI6D/Hhptw3J3gk44Fb49aMLS' //"asdf" is unecrypted and unsalted
			}
		];
		this.user = this.users[0];
	}
	async getUsers(orderBy, filter) {
		return this.users;
	}

	async getUser(id) {
		return this.users.filter(filterField('id', id))[0];
	}

	async getUserWithPassword(id) {
		return this.users.filter(filterField('id', id))[0];
	}

	async getUserWithSerial(serial) {
		return this.users.filter(filterField('serial', serial))[0];
	}

	async register({ username, email, password, role, isActive }) {
		if (role === undefined) {
			role = 'user';
		}

		console.log(password);
		var passwordHashed = await bcrypt.hash(password, 12);
		this.users.push({id: password, username, email, passwordHash: passwordHashed, role, isActive });
		return password;
	}

	createFacebookAuth({ id, displayName, userId }) {
		this.users.push({ fb_id: id, displayName, id: userId });
		return userId;
		// return returnId(knex('auth_facebook')).insert({ fb_id: id, display_name: displayName, user_id: userId });
	}

	// createGithubAuth({ id, displayName, userId }) {
	//   this.users.push({ fb_id: id, displayName, id: userId })
	//   return userId
	// }

	createGoogleOAuth({ id, displayName, userId }) {
		this.users.push({ fb_id: id, displayName, id: userId });
		return userId;
	}

	// createLinkedInAuth({ id, displayName, userId }) {
	//   this.users.push({ fb_id: id, displayName, id: userId })
	//   return userId
	// }

	async editUser({ id, username, email, role, isActive, password }) {
		return null;
	}

	async editUserProfile({ id, profile }) {
		return null;
	}

	// async editAuthCertificate({
	//   id,
	//   auth: {
	//     certificate: { serial }
	//   }
	// }) {
	//   const userProfile = await knex
	//     .select('id')
	//     .from('auth_certificate')
	//     .where({ user_id: id })
	//     .first();

	//   if (userProfile) {
	//     return knex('auth_certificate')
	//       .update({ serial })
	//       .where({ user_id: id });
	//   } else {
	//     return returnId(knex('auth_certificate')).insert({ serial, user_id: id });
	//   }
	// }

	deleteUser(id) {
		return null;
	}

	async updatePassword(id, newPassword) {
		return null;
	}

	updateActive(id, isActive) {
		return null;
	}

	async getUserByEmail(email) {
		return this.users.filter(filterField('email', email))[0];
	}

	async getUserByFbIdOrEmail(id, email) {
		return this.users.filter(filterField(['fb_id', 'email'], [id, email]))[0];
	}

	async getUserByGoogleIdOrEmail(id, email) {
		return this.users.filter(filterField(['google_id', 'email'], [id, email]))[0];
	}

	async getUserByUsername(username) {

		return this.users.filter(filterField('username', username))[0];
	}

	async getUserByUsernameOrEmail(usernameOrEmail) {
		// bcrypt.hash("asdf", 12).then(x=>console.log(x, "hashed"));
		// bcrypt.compare("asdf", "$2a$12$GiTLGeMeaoFyzAJhQKPms.BgaGo.KI6D/Hhptw3J3gk44Fb49aMLS").then(x=>console.log(x, "compared"));
		return this.users.filter(filterField(['username', 'email'], usernameOrEmail))[0];
	}
}
const userDAO = new User();

export default userDAO;


// // Actual query fetching and transformation in DB
// class User {
//   async getUsers(orderBy, filter) {
//     const queryBuilder = knex
//       .select(
//         'u.id as id',
//         'u.username',
//         'u.role',
//         'u.is_active',
//         'u.email',
//         'up.first_name',
//         'up.last_name',
//         'ca.serial',
//         'fa.fb_id',
//         'fa.display_name AS fbDisplayName',
//         'lna.ln_id',
//         'lna.display_name AS lnDisplayName',
//         'gha.gh_id',
//         'gha.display_name AS ghDisplayName',
//         'ga.google_id',
//         'ga.display_name AS googleDisplayName'
//       )
//       .from('user AS u')
//       .leftJoin('user_profile AS up', 'up.user_id', 'u.id')
//       .leftJoin('auth_certificate AS ca', 'ca.user_id', 'u.id')
//       .leftJoin('auth_facebook AS fa', 'fa.user_id', 'u.id')
//       .leftJoin('auth_google AS ga', 'ga.user_id', 'u.id')
//       .leftJoin('auth_github AS gha', 'gha.user_id', 'u.id')
//       .leftJoin('auth_linkedin AS lna', 'lna.user_id', 'u.id');

//     // add order by
//     if (orderBy && orderBy.column) {
//       let column = orderBy.column;
//       let order = 'asc';
//       if (orderBy.order) {
//         order = orderBy.order;
//       }

//       queryBuilder.orderBy(decamelize(column), order);
//     }

//     // add filter conditions
//     if (filter) {
//       if (has(filter, 'role') && filter.role !== '') {
//         queryBuilder.where(function() {
//           this.where('u.role', filter.role);
//         });
//       }

//       if (has(filter, 'isActive') && filter.isActive !== null) {
//         queryBuilder.where(function() {
//           this.where('u.is_active', filter.isActive);
//         });
//       }

//       if (has(filter, 'searchText') && filter.searchText !== '') {
//         queryBuilder.where(function() {
//           this.where('u.username', 'like', `%${filter.searchText}%`)
//             .orWhere('u.email', 'like', `%${filter.searchText}%`)
//             .orWhere('up.first_name', 'like', `%${filter.searchText}%`)
//             .orWhere('up.last_name', 'like', `%${filter.searchText}%`);
//         });
//       }
//     }

//     return camelizeKeys(await queryBuilder);
//   }

//   async getUser(id) {
//     return camelizeKeys(
//       await knex
//         .select(
//           'u.id',
//           'u.username',
//           'u.role',
//           'u.is_active',
//           'u.email',
//           'up.first_name',
//           'up.last_name',
//           'ca.serial',
//           'fa.fb_id',
//           'fa.display_name AS fbDisplayName',
//           'lna.ln_id',
//           'lna.display_name AS lnDisplayName',
//           'gha.gh_id',
//           'gha.display_name AS ghDisplayName',
//           'ga.google_id',
//           'ga.display_name AS googleDisplayName'
//         )
//         .from('user AS u')
//         .leftJoin('user_profile AS up', 'up.user_id', 'u.id')
//         .leftJoin('auth_certificate AS ca', 'ca.user_id', 'u.id')
//         .leftJoin('auth_facebook AS fa', 'fa.user_id', 'u.id')
//         .leftJoin('auth_google AS ga', 'ga.user_id', 'u.id')
//         .leftJoin('auth_github AS gha', 'gha.user_id', 'u.id')
//         .leftJoin('auth_linkedin AS lna', 'lna.user_id', 'u.id')
//         .where('u.id', '=', id)
//         .first()
//     );
//   }

//   async getUserWithPassword(id) {
//     return camelizeKeys(
//       await knex
//         .select(
//           'u.id',
//           'u.username',
//           'u.password_hash',
//           'u.role',
//           'u.is_active',
//           'u.email',
//           'up.first_name',
//           'up.last_name'
//         )
//         .from('user AS u')
//         .where('u.id', '=', id)
//         .leftJoin('user_profile AS up', 'up.user_id', 'u.id')
//         .first()
//     );
//   }

//   async getUserWithSerial(serial) {
//     return camelizeKeys(
//       await knex
//         .select('u.id', 'u.username', 'u.role', 'u.is_active', 'ca.serial', 'up.first_name', 'up.last_name')
//         .from('user AS u')
//         .leftJoin('auth_certificate AS ca', 'ca.user_id', 'u.id')
//         .leftJoin('user_profile AS up', 'up.user_id', 'u.id')
//         .where('ca.serial', '=', serial)
//         .first()
//     );
//   }

// async register({ username, email, password, role, isActive }) {
//   const passwordHash = await bcrypt.hash(password, 12);

//   if (role === undefined) {
//     role = 'user';
//   }

//   return returnId(knex('user')).insert({ username, email, role, password_hash: passwordHash, is_active: !!isActive });
// }

//   createFacebookAuth({ id, displayName, userId }) {
//     return returnId(knex('auth_facebook')).insert({ fb_id: id, display_name: displayName, user_id: userId });
//   }

//   createGithubAuth({ id, displayName, userId }) {
//     return returnId(knex('auth_github')).insert({ gh_id: id, display_name: displayName, user_id: userId });
//   }

//   createGoogleOAuth({ id, displayName, userId }) {
//     return returnId(knex('auth_google')).insert({ google_id: id, display_name: displayName, user_id: userId });
//   }

//   createLinkedInAuth({ id, displayName, userId }) {
//     return returnId(knex('auth_linkedin')).insert({ ln_id: id, display_name: displayName, user_id: userId });
//   }

//   async editUser({ id, username, email, role, isActive, password }) {
//     let localAuthInput = { email };
//     if (password) {
//       const passwordHash = await bcrypt.hash(password, 12);
//       localAuthInput = { email, password_hash: passwordHash };
//     }

//     return knex('user')
//       .update({
//         username,
//         role,
//         is_active: isActive,
//         ...localAuthInput
//       })
//       .where({ id });
//   }

//   async editUserProfile({ id, profile }) {
//     const userProfile = await knex
//       .select('id')
//       .from('user_profile')
//       .where({ user_id: id })
//       .first();

//     if (userProfile) {
//       return knex('user_profile')
//         .update(decamelizeKeys(profile))
//         .where({ user_id: id });
//     } else {
//       return returnId(knex('user_profile')).insert({ ...decamelizeKeys(profile), user_id: id });
//     }
//   }

//   async editAuthCertificate({
//     id,
//     auth: {
//       certificate: { serial }
//     }
//   }) {
//     const userProfile = await knex
//       .select('id')
//       .from('auth_certificate')
//       .where({ user_id: id })
//       .first();

//     if (userProfile) {
//       return knex('auth_certificate')
//         .update({ serial })
//         .where({ user_id: id });
//     } else {
//       return returnId(knex('auth_certificate')).insert({ serial, user_id: id });
//     }
//   }

//   deleteUser(id) {
//     return knex('user')
//       .where('id', '=', id)
//       .del();
//   }

//   async updatePassword(id, newPassword) {
//     const passwordHash = await bcrypt.hash(newPassword, 12);

//     return knex('user')
//       .update({ password_hash: passwordHash })
//       .where({ id });
//   }

//   updateActive(id, isActive) {
//     return knex('user')
//       .update({ is_active: isActive })
//       .where({ id });
//   }

//   async getUserByEmail(email) {
//     return camelizeKeys(
//       await knex
//         .select(
//           'u.id',
//           'u.username',
//           'u.password_hash',
//           'u.role',
//           'u.is_active',
//           'u.email',
//           'up.first_name',
//           'up.last_name'
//         )
//         .from('user AS u')
//         .leftJoin('user_profile AS up', 'up.user_id', 'u.id')
//         .where({ email })
//         .first()
//     );
//   }

//   async getUserByFbIdOrEmail(id, email) {
//     return camelizeKeys(
//       await knex
//         .select(
//           'u.id',
//           'u.username',
//           'u.role',
//           'u.is_active',
//           'fa.fb_id',
//           'u.email',
//           'u.password_hash',
//           'up.first_name',
//           'up.last_name'
//         )
//         .from('user AS u')
//         .leftJoin('auth_facebook AS fa', 'fa.user_id', 'u.id')
//         .leftJoin('user_profile AS up', 'up.user_id', 'u.id')
//         .where('fa.fb_id', '=', id)
//         .orWhere('u.email', '=', email)
//         .first()
//     );
//   }

//   async getUserByLnInIdOrEmail(id, email) {
//     return camelizeKeys(
//       await knex
//         .select(
//           'u.id',
//           'u.username',
//           'u.role',
//           'u.is_active',
//           'lna.ln_id',
//           'u.email',
//           'u.password_hash',
//           'up.first_name',
//           'up.last_name'
//         )
//         .from('user AS u')
//         .leftJoin('auth_linkedin AS lna', 'lna.user_id', 'u.id')
//         .leftJoin('user_profile AS up', 'up.user_id', 'u.id')
//         .where('lna.ln_id', '=', id)
//         .orWhere('u.email', '=', email)
//         .first()
//     );
//   }

//   async getUserByGHIdOrEmail(id, email) {
//     return camelizeKeys(
//       await knex
//         .select(
//           'u.id',
//           'u.username',
//           'u.role',
//           'u.is_active',
//           'gha.gh_id',
//           'u.email',
//           'u.password_hash',
//           'up.first_name',
//           'up.last_name'
//         )
//         .from('user AS u')
//         .leftJoin('auth_github AS gha', 'gha.user_id', 'u.id')
//         .leftJoin('user_profile AS up', 'up.user_id', 'u.id')
//         .where('gha.gh_id', '=', id)
//         .orWhere('u.email', '=', email)
//         .first()
//     );
//   }

//   async getUserByGoogleIdOrEmail(id, email) {
//     return camelizeKeys(
//       await knex
//         .select(
//           'u.id',
//           'u.username',
//           'u.role',
//           'u.is_active',
//           'ga.google_id',
//           'u.email',
//           'u.password_hash',
//           'up.first_name',
//           'up.last_name'
//         )
//         .from('user AS u')
//         .leftJoin('auth_google AS ga', 'ga.user_id', 'u.id')
//         .leftJoin('user_profile AS up', 'up.user_id', 'u.id')
//         .where('ga.google_id', '=', id)
//         .orWhere('u.email', '=', email)
//         .first()
//     );
//   }

//   async getUserByUsername(username) {
//     return camelizeKeys(
//       await knex
//         .select('u.id', 'u.username', 'u.role', 'u.is_active', 'u.email', 'up.first_name', 'up.last_name')
//         .from('user AS u')
//         .where('u.username', '=', username)
//         .leftJoin('user_profile AS up', 'up.user_id', 'u.id')
//         .first()
//     );
//   }

//   async getUserByUsernameOrEmail(usernameOrEmail) {
//     return camelizeKeys(
//       await knex
//         .select(
//           'u.id',
//           'u.username',
//           'u.password_hash',
//           'u.role',
//           'u.is_active',
//           'u.email',
//           'up.first_name',
//           'up.last_name'
//         )
//         .from('user AS u')
//         .where('u.username', '=', usernameOrEmail)
//         .orWhere('u.email', '=', usernameOrEmail)
//         .leftJoin('user_profile AS up', 'up.user_id', 'u.id')
//         .first()
//     );
//   }
// }
// const userDAO = new User();

// export default userDAO;
