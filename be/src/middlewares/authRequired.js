const jwt = require('jsonwebtoken');
const { appConfig } = require('../configs/app.config');
const { HTTP_STATUS } = require('../constants/httpStatus');
const { MESSAGES } = require('../constants/messages');

const authRequired = (req, res, next) => {
  const header = req.headers.authorization || '';
  const token = header.startsWith('Bearer ') ? header.slice(7) : null;

  if (!token) {
    return res.status(HTTP_STATUS.UNAUTHORIZED).json({
      status: 'error',
      message: MESSAGES.AUTH_UNAUTHORIZED,
    });
  }

  try {
    const payload = jwt.verify(token, appConfig.jwt.secret);
    req.userId = payload.sub;
    return next();
  } catch {
    return res.status(HTTP_STATUS.UNAUTHORIZED).json({
      status: 'error',
      message: MESSAGES.AUTH_INVALID_TOKEN,
    });
  }
};

module.exports = { authRequired };
