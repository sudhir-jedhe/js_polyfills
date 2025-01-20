import mongoose from 'mongoose';

const statusSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
  mediaUrl: {
    type: String,
  },
  statusType: {
    type: String,
    enum: ['text', 'image', 'video'],
    default: 'text',
  },
  viewers: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  }],
  expiresAt: {
    type: Date,
    required: true,
    default: () => new Date(+new Date() + 24*60*60*1000) // 24 hours from now
  }
}, { timestamps: true });

const Status = mongoose.model('Status', statusSchema);

export default Status;

