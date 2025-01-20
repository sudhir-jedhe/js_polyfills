import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema({
  phoneNumber: {
    type: String,
    required: true,
    unique: true,
  },
  name: {
    type: String,
    required: true,
  },
  profilePic: {
    type: String,
    default: '',
  },
  status: {
    type: String,
    default: 'Hey there! I am using WhatsApp.',
  },
  contacts: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  }],
  starredMessages: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Message',
  }],
  accounts: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  }],
}, { timestamps: true });

userSchema.pre('save', async function (next) {
  if (this.isModified('phoneNumber')) {
    this.phoneNumber = await bcrypt.hash(this.phoneNumber, 10);
  }
  next();
});

userSchema.methods.comparePhoneNumber = async function (phoneNumber) {
  return await bcrypt.compare(phoneNumber, this.phoneNumber);
};

const User = mongoose.model('User', userSchema);

export default User;

