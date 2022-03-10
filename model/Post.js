const mongoose = require('mongoose');

const PostSchema = new mongoose.Schema({
  user: {
    type: mongoose.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
  likes: {
    type: Number,
    default: 0,
  },
  comments: [{
    type: mongoose.Types.ObjectId,
    ref: 'Comment'
  }],
  picture: {
    type: String,
    default: '',
  },
});

module.exports = mongoose.model('Post', PostSchema);
