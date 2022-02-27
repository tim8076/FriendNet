const { StatusCodes } = require('http-status-codes');
const CustomAPIError = require('./custom-api');

// 使用者權限不夠 的錯誤
class UnauthorizedError  extends CustomAPIError {
  constructor(message) {
    super(message);
    this.statusCode = StatusCodes.FORBIDDEN;
  }
}

module.exports = UnauthorizedError;