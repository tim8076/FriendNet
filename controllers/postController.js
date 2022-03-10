const Post = require('../model/Post');
const Comment = require('../model/Comment');
const { StatusCodes } = require('http-status-codes');
const CustomError = require('../errors/index');
const { checkIdentity } = require('../utils/checkIdentity');

const getAllPosts = async (req, res) => {
  const posts = await Post.find({})
    .populate({
      path: 'user',
      select: 'name photos'
    })
    .populate({
      path: 'comments',
      select: '-content',
      populate: {
        path: 'user',
        select: 'name photos'
      }
    });
  res.status(StatusCodes.OK).json({
    success: true,
    posts,
  });
};

const getSinglePost = async (req, res) => {
  const { id: postId } = req.params;
  const post = await Post.findOne({ _id: postId })
    .populate({
      path: 'user',
      select: 'name photos',
    })
    .populate({
      path: 'comments',
      populate: {
        path: 'user',
        select: 'name photos'
      }
    })
  if (!post) {
    throw new CustomError.NotFoundError(`找不到 id 為 ${postId} 的貼文`);
  }
  res.status(StatusCodes.OK).json({
    success: true,
    post,
  })
};

// 新增貼文
const createPost = async (req, res) => {
  const { content, picture } = req.body;
  const { userId } = req.user;
  if (!content) {
    throw new CustomError.BadRequestError('請提供貼文內容');
  };
  const postContent = await Post.create({ user: userId, content, picture });
  res.status(StatusCodes.OK).json({
    success: true,
    msg: '成功新增貼文',
  })
};

// 刪除單一貼文
const deleteSinglePost = async (req, res) => {
  const { userId } = req.user;
  const { id: postId } = req.params;
  const post = await Post.findOne({ _id: postId });
  if (!post) {
    throw new CustomError.NotFoundError(`找不到id為 ${postId} 的貼文`);
  };
  // 只有自己的帳號能刪除自己的貼文
  checkIdentity({ target: post, userId });

  // 刪除貼文和所有此貼文的留言
  await Post.deleteOne({ _id: postId });
  await Comment.deleteMany({ post: postId });
  res.status(StatusCodes.OK).json({
    success: true,
    msg: '成功刪除貼文',
  })
};

// 更新單一貼文
const updateSinglePost = async (req, res) => {
  const { userId } = req.user;
  const { id: postId } = req.params;
  const newPost = req.body.content;
  const post = await Post.findOne({ _id: postId });

  // 確認更新的貼文內容是否有傳來
  if (!newPost) {
    throw new CustomError.BadRequestError('請提供更新的貼文內容');
  }
  // 只有自己的帳號能修改自己的貼文
  checkIdentity({ target: post, userId });
  const updatedPost = await Post.findOneAndUpdate({ _id: postId }, req.body, {
     new: true, runValidators: true 
  });
  res.status(StatusCodes.OK).json({
    success: true,
    msg: '成功更新貼文',
    updatedPost,
  })
};

const likePost = async (req, res) => {
  const { likes } = req.body;
  const { id: postId } = req.params;
  if (!likes) {
    throw new CustomError.BadRequestError('請提供貼文讚數');
  }
  await Post.findOneAndUpdate({ _id: postId }, req.body, {
    new: true, runValidators: true
  });
  res.status(StatusCodes.OK).json({
    success: true,
    msg: '按贊成功',
  })
}

module.exports = {
  getAllPosts,
  getSinglePost,
  createPost,
  deleteSinglePost,
  updateSinglePost,
  likePost,
};