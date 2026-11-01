const UserService = require('./user.service');
const { successResponse } = require('../../helpers/responseHelper');
const { HTTP_STATUS } = require('../../constants/httpStatus');
const { MESSAGES } = require('../../constants/messages');

class UserController {
  static async updateOnboarding(req, res) {
    const user = await UserService.updateOnboarding(req.userId, req.body.completed);
    return successResponse(res, {
      statusCode: HTTP_STATUS.OK,
      message: MESSAGES.USER_ONBOARDING_UPDATED,
      data: { user },
    });
  }
}

module.exports = UserController;
