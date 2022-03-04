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
    }
  },
  password: {
    type: String,
    required: [true, '請提供密碼'],
    minlength: 6,
  },
  address: {
    type: String,
    minlength: 6,
    default: '',
  },
  job: {
    type: String,
    default: '',
  },
  love: {
    type: String,
    minlength: 6,
    enum: ['單身', '已婚', '穩定交往中'],
    default: '單身',
  },
  selfInfo: {
    type: String,
    default: '',
  },
  photos: {
    type: String, //圖片url 位置
    default: '',
  },
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