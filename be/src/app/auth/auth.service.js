const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const UserModel = require('../user/user.model');
const { appConfig } = require('../../configs/app.config');
const { HTTP_STATUS } = require('../../constants/httpStatus');
const { MESSAGES } = require('../../constants/messages');

const httpError = (statusCode, message) => {
  const error = new Error(message);
  error.statusCode = statusCode;
  return error;
};

const signToken = (userId) =>
  jwt.sign({ sub: userId }, appConfig.jwt.secret, {
    expiresIn: appConfig.jwt.expiresIn,
  });

const toPublic = (user) => ({
  id: user.id,
  email: user.email,
  name: user.name,
  onboardingCompleted: user.onboarding_completed ?? false,
  createdAt: user.created_at,
});

class AuthService {
  static async register({ email, password, name }) {
    const existing = await UserModel.findByEmail(email);
    if (existing) {
      throw httpError(HTTP_STATUS.CONFLICT, MESSAGES.AUTH_EMAIL_IN_USE);
    }
    const passwordHash = await bcrypt.hash(password, 10);
    const user = await UserModel.create({ email, name, passwordHash });
    return { user: toPublic(user), token: signToken(user.id) };
  }

  static async login({ email, password }) {
    const user = await UserModel.findByEmail(email);
    if (!user) {
      throw httpError(HTTP_STATUS.UNAUTHORIZED, MESSAGES.AUTH_INVALID_CREDENTIALS);
    }
    const matches = await bcrypt.compare(password, user.password_hash);
    if (!matches) {
      throw httpError(HTTP_STATUS.UNAUTHORIZED, MESSAGES.AUTH_INVALID_CREDENTIALS);
    }
    return { user: toPublic(user), token: signToken(user.id) };
  }

  static async me(userId) {
    const user = await UserModel.findById(userId);
    if (!user) {
      throw httpError(HTTP_STATUS.UNAUTHORIZED, MESSAGES.AUTH_INVALID_TOKEN);
    }
    return toPublic(user);
  }
}

module.exports = AuthService;
module.exports.toPublic = toPublic;
