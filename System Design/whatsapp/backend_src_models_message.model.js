import mongoose from 'mongoose';

const messageSchema = new mongoose.Schema({
  sender: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  receiver: {
    type: mongoose.Schema.Types.ObjectId,
    refPath: 'receiverModel',
    required: true,
  },
  receiverModel: {
    type: String,
    required: true,
    enum: ['User', 'Group'],
  },
  content: {
    type: String,
    required: true,
  },
  messageType: {
    type: String,
    enum: ['text', 'image', 'audio', 'video', 'document', 'location'],
    default: 'text',
  },
  mediaUrl: {
    type: String,
  },
  status: {
    type: String,
    enum: ['sent', 'delivered', 'read'],
    default: 'sent',
  },
  formattedContent: {
    type: String,
  },
  forwardedFrom: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Message',
  },
  isStarred: {
    type: Boolean,
    default: false,
  },
}, { timestamps: true });

const Message = mongoose.model('Message', messageSchema);

export default Message;

