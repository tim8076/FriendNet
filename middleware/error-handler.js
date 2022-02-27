const { StatusCodes } = require('http-status-codes');

const errorHandlerMiddleware = (err, req, res, next) => {
  let customError = {
    statusCode: err.statusCode || StatusCodes.INTERNAL_SERVER_ERROR,
    msg: err.message || '發生伺服器端的錯誤',
  };

  if (err.name === 'ValidationError') {
    customError.msg = Object.values(err.errors)
      .map((item) => item.message)
      .join(',');
    customError.statusCode = 400;
  }
  if (err.code && err.code === 11000) {
    customError.msg = `重複的值 ${Object.keys(
      err.keyValue
    )}, 請選擇另一個值`;
    customError.statusCode = 400;
  }
  if (err.name === 'CastError') {
    customError.msg = ` 找不到 id 為 ${err.value} 的項目`;
    customError.statusCode = 404;
  }

  return res.status(customError.statusCode).json({ msg: customError.msg });
}

module.exports = errorHandlerMiddleware;