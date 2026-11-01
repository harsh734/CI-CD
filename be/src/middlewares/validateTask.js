const { HTTP_STATUS } = require('../constants/httpStatus');
const { MESSAGES } = require('../constants/messages');

const VALID_PRIORITIES = ['low', 'medium', 'high'];
const VALID_STATUSES = ['active', 'completed'];
const VALID_CATEGORIES = ['work', 'personal', 'health', 'learning', 'shopping'];

const fail = (res, message) =>
  res.status(HTTP_STATUS.BAD_REQUEST).json({ status: 'error', message });

const checkCommonFields = (body) => {
  if (body.priority !== undefined && !VALID_PRIORITIES.includes(body.priority)) {
    return MESSAGES.INVALID_PRIORITY;
  }
  if (body.status !== undefined && !VALID_STATUSES.includes(body.status)) {
    return MESSAGES.INVALID_STATUS;
  }
  if (body.category !== undefined && !VALID_CATEGORIES.includes(body.category)) {
    return MESSAGES.INVALID_CATEGORY;
  }
  return null;
};

const validateCreateTask = (req, res, next) => {
  const { title } = req.body;

  if (!title || typeof title !== 'string' || title.trim() === '') {
    return fail(res, MESSAGES.TITLE_REQUIRED);
  }
  const err = checkCommonFields(req.body);
  if (err) return fail(res, err);

  req.body.title = title.trim();
  req.body.priority = req.body.priority || 'medium';
  req.body.status = req.body.status || 'active';
  req.body.category = req.body.category || 'work';
  if (req.body.description !== undefined && typeof req.body.description !== 'string') {
    req.body.description = null;
  }
  next();
};

const validateUpdateTask = (req, res, next) => {
  const { title } = req.body;
  if (title !== undefined && (typeof title !== 'string' || title.trim() === '')) {
    return fail(res, MESSAGES.TITLE_REQUIRED);
  }
  const err = checkCommonFields(req.body);
  if (err) return fail(res, err);

  if (title) req.body.title = title.trim();
  next();
};

module.exports = { validateCreateTask, validateUpdateTask };
