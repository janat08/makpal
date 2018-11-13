import { writeSession } from './sessions';

export default () => ({
	Mutation: {
		logout(obj, args, { req }) {
			const session = { ...req.session };

			delete session.userId;
			console.log('logging out');
			req.session = writeSession(req, session);
		}
	}
});
