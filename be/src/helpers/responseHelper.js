const { HTTP_STATUS } = require('../constants/httpStatus');

const successResponse = (res, { statusCode = HTTP_STATUS.OK, message = 'Success', data = null }) => {
  return res.status(statusCode).json({
    status: 'success',
    message,
    data,
  });
};

const errorResponse = (res, { statusCode = HTTP_STATUS.INTERNAL_SERVER_ERROR, message = 'Error' }) => {
  return res.status(statusCode).json({
    status: 'error',
    message,
  });
};

module.exports = { successResponse, errorResponse };
