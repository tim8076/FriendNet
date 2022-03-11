const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');

const UserSchema = mongoose.Schema({
  name: {
    type: String,
    required: [true, '請提供姓名'],
    maxlength: 50,
    minlength: 2
  },
  email: {
    type: String,
    required: [true, '請提供信箱'],
    unique: true,
    validate: {
      validator: validator.isEmail,
      message: '請提供電子信箱'
    },
    trim: true,
  },
  password: {
    type: String,
    required: [true, '請提供密碼'],
    minlength: 6,
    trim: true,
  },
  address: {
    type: String,
    minlength: 6,
    default: '',
    trim: true,
  },
  job: {
    type: String,
    default: '',
    trim: true,
  },
  love: {
    type: String,
    enum: ['單身', '已婚', '穩定交往中'],
    default: '單身',
    trim: true,
  },
  selfInfo: {
    type: String,
    default: '',
    trim: true,
  },
  photos: {
    type: String, //圖片url 位置
    default: '',
    trim: true,
  },
  posts: [{
    type: mongoose.Types.ObjectId,
    ref: 'Post',
  }],
  friends: [{
    type: mongoose.Types.ObjectId,
    ref: 'User',
  }],
})

UserSchema.pre('save', async function(){
  // 如果修改的不是password，就 return
  if (!this.isModified('password')) return;
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
})

UserSchema.methods.comparePassword = async function(candidatePassword){
  const isMatch = await bcrypt.compare(candidatePassword, this.password);
  return isMatch;
}

module.exports = mongoose.model('User', UserSchema);