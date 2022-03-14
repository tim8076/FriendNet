const Post = require('../model/Post');
const Comment = require('../model/Comment');
const User = require('../model/User');
const { StatusCodes } = require('http-status-codes');
const CustomError = require('../errors/index');
const { checkIdentity } = require('../utils/checkIdentity');

// 新增貼文留言
const createComment = async (req, res) => {
  // #swagger.tags = ['Comments']
  // #swagger.description = '新增貼文留言'
  /* #swagger.parameters['obj'] = {
          in: 'body',
          description: 'comment, postId 是必填參數',
          required: true,
  } */
  const { comment, postId } = req.body;
  const { userId } = req.user;
  if (!comment) {
    throw new CustomError.BadRequestError('請提供留言資料');
  };
  const post = await Post.findOne({ _id: postId });
  const newComment = await Comment.create({ user: userId, comment, post: postId });
  post.comments.push(newComment._id);
  await post.save();
  res.status(StatusCodes.OK).json({
    success: true,
    msg: '新增留言成功',
  });
};

const updateComment = async (req, res) => {
  // #swagger.tags = ['Comments']
  // #swagger.description = '更新貼文'
  const { comment } = req.body;
  const { id: commentId } = req.params;
  const { userId } = req.user;
  if (!comment ) {
    throw new CustomError.BadRequestError('請提供留言資料');
  };

  const updatingComment = await Comment.findOne({ _id: commentId });
  if (!updatingComment) {
    throw new CustomError.NotFoundError(`找不到id為 ${updatingComment} 的留言`);
  }

  //只有自己能修改自己的留言
  checkIdentity({ target: updatingComment, userId });
  updatingComment.comment = comment;
  const updatedComment = await updatingComment.save();

  // 更新貼文裡的留言
  const post = await Post.findOne({ _id: updatingComment.post });
  post.comments.forEach((comment, index) => {
    if (comment.valueOf() === commentId) {
      post.comments.splice(index, 1);
      post.comments.splice(index, 0, updatedComment._id);
    }
  });
  await post.save();
  res.status(StatusCodes.OK).json({
    success: true,
    msg: '修改留言成功', 
  })
};

const deleteComment = async (req, res) => {
  // #swagger.tags = ['Comments']
  // #swagger.description = '刪除留言'
  const { id: commentId } = req.params;
  const { userId } = req.user;
  const comment = await Comment.findOne({ _id: commentId});

  //只有自己能刪除自己的留言
  checkIdentity({ target: comment, userId });

  await Comment.findOneAndDelete({ _id: commentId });
  
  // 刪除貼文裡的留言
  const post = await Post.findOne({ _id: comment.post });
  post.comments.forEach((comment, index) => {
    if (comment.valueOf() === commentId) {
      post.comments.splice(index, 1);
    }
  })
  await post.save();
  res.status(StatusCodes.OK).json({
    success: true,
    msg: '刪除留言成功',
  })
};

module.exports = {
  createComment,
  updateComment,
  deleteComment,
};