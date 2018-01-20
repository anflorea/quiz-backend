import mongoose from 'mongoose';
import crypto from 'crypto';

const Schema = mongoose.Schema;

const User = new Schema({
  createdAt: Date,
  updatedAt: Date,
  username: {
    type: String,
    trim: true,
    unique: true,
    required: true,
    lowercase: true
  },
  email: {
    type: String,
    required: true,
    trim: true,
    lowercase: true,
    unique: true,
    match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'The email address is not valid']
  },
  password: {
    type: String,
    required: true
  },
  firstName: {
    type: String,
    required: true,
    trim: true
  },
  lastName: {
    type: String,
    required: true,
    trim: true
  },
  role: {
    type: String,
    required: true,
    default: 'EXAMINEE'
  }
}, {
    timestamps: { createdAt: 'createdAt', updatedAt: 'updatedAt' }
});

User.path('password').validate(function (v) {
  return v.length > 5 && v.length < 15;
}, 'Password must be between 5 and 15 characters!');

User.pre('save', function (next) {
  var user = this;

  if (user.password.length > 15)
    next();

  let hash = crypto.createHash('sha256').update(user.password).digest('base64');
  this.password = hash;

  next();
});

export default mongoose.model('User', User);