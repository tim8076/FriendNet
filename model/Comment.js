const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema({
  user: {
    type: mongoose.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  comment: {
    type: String,
    required: true,
  },
  post: {
    type: mongoose.Types.ObjectId,
    ref: 'Post',
    required: true,
  }
});

module.exports = mongoose.model('Comment', commentSchema);