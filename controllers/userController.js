const User = require('../model/User');
const { StatusCodes } = require('http-status-codes');
const CustomError = require('../errors/index');
const { attachCookieToResponse, createTokenUser } = require('../utils/index');

// 取得除了帳密以外的 所有使用者資料
const getAllUsers = async (req, res) => {
  const users = await User.find({}).select('-password');
  res.status(StatusCodes.OK).json({
    success: true,
    users,
  });
}

// 取得單一使用者資料
const getSingleUser = async (req, res) => {
  const userId = req.params.id;
  const user = await User.findOne({ _id: userId }).select('-password');
  if (!user) {
    throw new CustomError.NotFoundError(`沒有 id 為 ${userId} 的使用者`);
  }
  res.status(StatusCodes.OK).json({
    success: true,
    user,
  })
} 

const showCurrentUser = async (req, res) => {
  res.status(StatusCodes.OK).json({
    success: true,
    user: req.user
  })
}

// 更新使用者資料(帳密以外)
const updateUser = async (req, res) => {
  const userId = req.params.id;
  const { name, address, job, family, selfInfo, photos } = req.body;
  const userObj = { name, address, job, family, selfInfo, photos };
  for (let prop in userObj) {
    if (!userObj[prop]) userObj[prop] = '';
  }
  const user = await User.findOneAndUpdate({ _id: userId }, userObj, {
    new: true,
    runValidators: true,
  });
  const tokenUser = createTokenUser(user);
  attachCookieToResponse({ res,  user: tokenUser});
  res.status(StatusCodes.OK).json({
    success: true,
    msg: '使用者資料更新成功',
    user,
  });
} 

// 更新使用者密碼
const updateUserPassword = async (req, res) => {
  const { newPassword, oldPassword } = req.body;
  if (!newPassword || !oldPassword) {
    throw new CustomError.BadRequestError('請提供新密碼與舊密碼');
  }
  const user = await User.findOne({ _id: req.user.userId });
  const isPasswordCorrect = await user.comparePassword(oldPassword);
  if (!isPasswordCorrect) {
    throw new CustomError.UnauthenticatedError('舊密碼錯誤, 請提供正確密碼');
  }

  user.password = newPassword;
  await user.save();
  res.status(StatusCodes.OK).json({
    success: true,
    msg: '密碼更新成功',
  })
}

module.exports = {
  getAllUsers,
  getSingleUser,
  updateUser,
  updateUserPassword,
  showCurrentUser,
};

