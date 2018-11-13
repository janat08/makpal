import jwt from 'jsonwebtoken';
import createTokens from './createTokens';
import config from 'config';

export default () => ({
	Mutation: {
		async refreshTokens(obj, { refreshToken: inputRefreshToken }, { User, res }) {
			const { user: id } = jwt.decode(inputRefreshToken);

			const user = await User.getUserWithPassword(id);
			const refreshSecret = config.user.secret + user.passwordHash;

			try {
				jwt.verify(inputRefreshToken, refreshSecret);
			} catch (e) {
				res.status(401);
				throw e;
			}

			const [accessToken, refreshToken] = await createTokens(user, config.user.secret, refreshSecret);

			return {
				accessToken,
				refreshToken
			};
		}
	}
});
