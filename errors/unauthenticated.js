const { StatusCodes } = require('http-status-codes');
const CustomAPIError = require('./custom-api');

// 使用者未登入 回傳的錯誤
class UnauthenticatedError extends CustomAPIError {
  constructor(message) {
    super(message);
    this.statusCode = StatusCodes.UNAUTHORIZED;
  }
}

module.exports = UnauthenticatedError;