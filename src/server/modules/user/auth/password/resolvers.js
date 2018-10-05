import bcrypt from 'bcryptjs';
import { pick } from 'lodash';
import jwt from 'jsonwebtoken';

import access from '../../access';
import User from '../../sql';
import FieldError from '../../../../../common/FieldError';
import config from 'config';

const validateUserPassword = async (user, password) => {
  const e = new FieldError();

  if (!user) {
    // user with provided email not found
    e.setError('usernameOrEmail', 'validEmail');
    e.throwIf();
  }
  if (config.user.auth.password.confirm && !user.isActive) {
    e.setError('usernameOrEmail', 'emailConfirmation');
    e.throwIf();
  }
  const valid = await bcrypt.compare(password, user.passwordHash);
  if (!valid) {
    // bad password
    e.setError('password', 'validPassword');
    e.throwIf();
  }
};

export default () => ({
  Mutation: {
    async login(
      obj,
      {
        input: { usernameOrEmail, password }
      },
      { req }
    ) {
      try {
        const user = await User.getUserByUsernameOrEmail(usernameOrEmail);

        await validateUserPassword(user, password);

        const tokens = await access.grantAccess(user, req);

        return { user, tokens };
      } catch (e) {
        return { errors: e };
      }
    },
    async register(obj, { input }, { mailer, User, req }) {
      try {
        const { t } = req;
        const e = new FieldError();
        const userExists = await User.getUserByUsername(input.username);
        if (userExists) {
          e.setError('username', 'usernameIsExisted');
        }

        const emailExists = await User.getUserByEmail(input.email);
        if (emailExists) {
          e.setError('email', 'emailIsExisted');
        }

        e.throwIf();

        let userId = 0;
        if (!emailExists) {
          let isActive = false;
          if (!config.user.auth.password.confirm) {
            isActive = true;
          }

          [userId] = await User.register({ ...input, isActive });

          // if user has previously logged with facebook auth
        } else {
          await User.updatePassword(emailExists.userId, input.password);
          userId = emailExists.userId;
        }

        const user = await User.getUser(userId);

        if (mailer && config.user.auth.password.sendConfirmationEmail && !emailExists && req) {
          // async email
          jwt.sign({ user: pick(user, 'id') }, config.user.secret, { expiresIn: '1d' }, (err, emailToken) => {
            const encodedToken = Buffer.from(emailToken).toString('base64');
            const url = `${__WEBSITE_URL__}/confirmation/${encodedToken}`;
            mailer.sendMail({
              from: `${config.app.name} <${process.env.EMAIL_USER}>`,
              to: user.email,
              subject: 'Confirm Email',
              html: `<p>Hi, ${user.username}!</p>
              <p>Welcome to ${config.app.name}. Please click the following link to confirm your email:</p>
              <p><a href="${url}">${url}</a></p>
              <p>Below are your login information</p>
              <p>Your email is: ${user.email}</p>
              <p>Your password is: ${input.password}</p>`
            });
          });
        }
        console.log({user}, "user is registered?")

        return { user };
      } catch (e) {
        return { errors: e };
      }
    },
    async forgotPassword(obj, { input }, context) {
      try {
        const localAuth = pick(input, 'email');
        const user = await context.User.getUserByEmail(localAuth.email);

        if (user && context.mailer) {
          // async email
          jwt.sign(
            { email: user.email, password: user.passwordHash },
            config.user.secret,
            { expiresIn: '1d' },
            (err, emailToken) => {
              // encoded token since react router does not match dots in params
              const encodedToken = Buffer.from(emailToken).toString('base64');
              const url = `${__WEBSITE_URL__}/reset-password/${encodedToken}`;
              context.mailer.sendMail({
                from: `${config.app.name} <${process.env.EMAIL_USER}>`,
                to: user.email,
                subject: 'Reset Password',
                html: `Please click this link to reset your password: <a href="${url}">${url}</a>`
              });
            }
          );
        }
      } catch (e) {
        // don't throw error so you can't discover users this way
      }
    },
    async resetPassword(
      obj,
      { input },
      {
        req: { t },
        User
      }
    ) {
      try {
        const e = new FieldError();
        const reset = pick(input, ['password', 'passwordConfirmation', 'token']);
        if (reset.password !== reset.passwordConfirmation) {
          e.setError('password', 'user:auth.password.passwordsIsNotMatch');
        }

        if (reset.password.length < 8) {
          e.setError('password', 'user:auth.password.passwordLength');
        }
        e.throwIf();

        const token = Buffer.from(reset.token, 'base64').toString();
        const { email, password } = jwt.verify(token, config.user.secret);
        const user = await User.getUserByEmail(email);
        if (user.passwordHash !== password) {
          e.setError('token', 'user:auth.password.invalidToken');
          e.throwIf();
        }

        if (user) {
          await User.updatePassword(user.id, reset.password);
        }
        return { errors: null };
      } catch (e) {
        return { errors: e };
      }
    }
  }
});
