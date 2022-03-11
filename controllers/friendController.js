const User = require('../model/User');
const { StatusCodes } = require('http-status-codes');
const CustomError = require('../errors/index');

// 取得好友列表
const getAllFriends = async (req, res) => {
  console.log('getAllFriends');
};

// 加入好友
const addFriend = async (req, res) => {
  const { id: friendId } = req.body;
  const { userId } = req.user;
  const currentUser = await User.findOne({ _id: userId });
  if (!currentUser) {
    throw new CustomError.NotFoundError(`找不到id 為 ${friendId} 的使用者`);
  }
  currentUser.friends.push(friendId);
  await currentUser.save();
  res.status(StatusCodes.OK).json({
    success: true,
    msg: '成功加入好友',
  });
};

// 取消好友
const removeFriend = async (req, res) => {
  const { id: friendId } = req.body;
  const { userId } = req.user;
  const currentUser = await User.findOne({ _id: userId });
  if (!currentUser) {
    throw new CustomError.NotFoundError(`找不到id 為 ${friendId} 的使用者`);
  };
  currentUser.friends.forEach( (friend, index) => {
    if (friend.valueOf() === friendId) {
      currentUser.friends.splice(index, 1);
    }
  });
  await currentUser.save();
  res.status(StatusCodes.OK).json({
    success: true,
    msg: '成功刪除好友',
  });
};

module.exports = {
  getAllFriends,
  addFriend,
  removeFriend,
};