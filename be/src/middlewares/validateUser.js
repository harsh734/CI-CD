const { HTTP_STATUS } = require('../constants/httpStatus');
const { MESSAGES } = require('../constants/messages');

const fail = (res, message) =>
  res.status(HTTP_STATUS.BAD_REQUEST).json({ status: 'error', message });

const validateOnboarding = (req, res, next) => {
  if (typeof req.body?.completed !== 'boolean') {
    return fail(res, MESSAGES.INVALID_ONBOARDING_FLAG);
  }
  next();
};

module.exports = { validateOnboarding };
