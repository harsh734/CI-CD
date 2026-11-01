const { HTTP_STATUS } = require('../constants/httpStatus');
const { MESSAGES } = require('../constants/messages');

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const fail = (res, message) =>
  res.status(HTTP_STATUS.BAD_REQUEST).json({ status: 'error', message });

const validateRegister = (req, res, next) => {
  const { email, password, name } = req.body || {};
  if (!email || typeof email !== 'string' || !EMAIL_RE.test(email.trim())) {
    return fail(res, MESSAGES.EMAIL_REQUIRED);
  }
  if (!password || typeof password !== 'string' || password.length < 6) {
    return fail(res, MESSAGES.PASSWORD_REQUIRED);
  }
  if (!name || typeof name !== 'string' || name.trim() === '') {
    return fail(res, MESSAGES.NAME_REQUIRED);
  }
  req.body.email = email.trim().toLowerCase();
  req.body.name = name.trim();
  next();
};

const validateLogin = (req, res, next) => {
  const { email, password } = req.body || {};
  if (!email || typeof email !== 'string' || !EMAIL_RE.test(email.trim())) {
    return fail(res, MESSAGES.EMAIL_REQUIRED);
  }
  if (!password || typeof password !== 'string') {
    return fail(res, MESSAGES.PASSWORD_REQUIRED);
  }
  req.body.email = email.trim().toLowerCase();
  next();
};

module.exports = { validateRegister, validateLogin };
