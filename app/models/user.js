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

User.pre('save', function (next) {
  var user = this;

  console.log(user);

  let hash = crypto.createHash('sha256').update(user.password).digest('base64');
  this.password = hash;

  next();
});

export default mongoose.model('User', User);