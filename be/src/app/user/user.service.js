const UserModel = require('./user.model');
const { toPublic } = require('../auth/auth.service');
const { HTTP_STATUS } = require('../../constants/httpStatus');
const { MESSAGES } = require('../../constants/messages');

const httpError = (statusCode, message) => {
  const error = new Error(message);
  error.statusCode = statusCode;
  return error;
};

class UserService {
  static async updateOnboarding(userId, completed) {
    const user = await UserModel.updateOnboarding(userId, !!completed);
    if (!user) {
      throw httpError(HTTP_STATUS.NOT_FOUND, MESSAGES.USER_NOT_FOUND);
    }
    return toPublic(user);
  }
}

module.exports = UserService;
