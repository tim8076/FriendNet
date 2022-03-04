const CustomError = require('../errors/index');
const { isTokenValid } = require('../utils');

// 確認是否為登入狀態
const authenticateUser = async (req, res, next) => {
  const token = req.signedCookies.token;
  console.log(token)
  if (!token) {
    throw new CustomError.UnauthenticatedError('驗證失敗, 請先登入');
  }
  try {
    const { name, userId } = isTokenValid({ token });
    req.user = {
      name, 
      userId,
    }
    next();
  } catch (err) {
    throw new CustomError.UnauthenticatedError('驗證失敗, 請先登入')
  }
}

module.exports = { authenticateUser };