const AuthService = require('./auth.service');
const { successResponse } = require('../../helpers/responseHelper');
const { HTTP_STATUS } = require('../../constants/httpStatus');
const { MESSAGES } = require('../../constants/messages');

class AuthController {
  static async register(req, res) {
    const result = await AuthService.register(req.body);
    return successResponse(res, {
      statusCode: HTTP_STATUS.CREATED,
      message: MESSAGES.AUTH_REGISTERED,
      data: result,
    });
  }

  static async login(req, res) {
    const result = await AuthService.login(req.body);
    return successResponse(res, {
      statusCode: HTTP_STATUS.OK,
      message: MESSAGES.AUTH_LOGGED_IN,
      data: result,
    });
  }

  static async me(req, res) {
    const user = await AuthService.me(req.userId);
    return successResponse(res, {
      statusCode: HTTP_STATUS.OK,
      message: MESSAGES.AUTH_ME,
      data: { user },
    });
  }
}

module.exports = AuthController;
//hello