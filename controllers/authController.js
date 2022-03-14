const User = require('../model/User');
const { StatusCodes } = require('http-status-codes');
const CustomError = require('../errors/index');
const { attachCookieToResponse, createTokenUser } = require('../utils/index');

const register = async (req, res) => {
  // #swagger.tags = ['Auth']
  // #swagger.description = '使用者註冊'
  /* #swagger.parameters['email', 'password', 'name'] = {
           in: 'body',
           description: 'password, email, name 是必填參數',
           required: true,
  } */
  const { email, password, name } = req.body;
  const emailAlreadyExists = await User.findOne({ email });
  if (emailAlreadyExists) {
    throw new CustomError.BadRequestError('此 email 已被使用');
  }

  const user = await User.create({ email, password, name });
  const tokenUser = { name:user.name, userId: user._id };
  attachCookieToResponse({ res, user: tokenUser });
  res.status(StatusCodes.CREATED).json({
    success: true, 
    user: tokenUser 
  });
}

const login = async (req, res) => {
  // #swagger.tags = ['Auth']
  // #swagger.description = '使用者登入'
  /* #swagger.parameters['email', 'password'] = {
          in: 'body',
          description: 'password, email 是必填參數',
          required: true,
  } */
  const { email, password } = req.body;
  if (!email || !password) {
    throw new CustomError.BadRequestError('請提供帳號和密碼');
  }
  // 確認使否使用者存在
  const user = await User.findOne({ email });
  if (!user) {
    throw new CustomError.UnauthenticatedError('權限不足');
  }

  // 確認密碼是否正確
  const isPasswordCorrect = await user.comparePassword(password);
  if (!isPasswordCorrect) {
    throw new CustomError.UnauthenticatedError('密碼錯誤');
  }
  
  const tokenUser = createTokenUser(user);
  attachCookieToResponse({ res, user: tokenUser });
  res.status(StatusCodes.CREATED).json({
    success: true,
    user: tokenUser 
  });
}

const logout = (req, res) => {
  // #swagger.tags = ['Auth']
  // #swagger.description = '使用者登出'
  res.cookie('token', 'logout', {
    httpOnly: true,
    expires: new Date(Date.now())
  })
  res.status(StatusCodes.OK).json({
    success: true,
    msg: '登出成功'
  })
}

module.exports = {
  register,
  login,
  logout,
}