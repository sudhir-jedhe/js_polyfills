import Message from '../models/message.model.js';
import User from '../models/user.model.js';
import Group from '../models/group.model.js';
import { io } from '../app.js';
import { uploadMedia } from '../services/media.service.js';

export const sendMessage = async (req, res) => {
  try {
    const { receiverId, content, messageType, formattedContent, receiverModel } = req.body;
    const senderId = req.user.id;
    let mediaUrl;

    if (messageType !== 'text' && req.file) {
      mediaUrl = await uploadMedia(req.file);
    }

    const message = new Message({
      sender: senderId,
      receiver: receiverId,
      receiverModel,
      content,
      messageType,
      mediaUrl,
      formattedContent,
    });

    await message.save();

    // Emit the message to the receiver(s)
    if (receiverModel === 'User') {
      io.to(receiverId).emit('new_message', message);
    } else if (receiverModel === 'Group') {
      const group = await Group.findById(receiverId);
      group.members.forEach(member => {
        if (member.user.toString() !== senderId) {
          io.to(member.user.toString()).emit('new_message', message);
        }
      });
    }

    res.status(201).json(message);
  } catch (error) {
    res.status(500).json({ message: 'Error sending message', error: error.message });
  }
};

export const getMessages = async (req, res) => {
  try {
    const { receiverId, receiverModel } = req.params;
    const currentUserId = req.user.id;

    let messages;
    if (receiverModel === 'User') {
      messages = await Message.find({
        $or: [
          { sender: currentUserId, receiver: receiverId, receiverModel: 'User' },
          { sender: receiverId, receiver: currentUserId, receiverModel: 'User' },
        ],
      }).sort({ createdAt: 1 });
    } else if (receiverModel === 'Group') {
      messages = await Message.find({
        receiver: receiverId,
        receiverModel: 'Group',
      }).sort({ createdAt: 1 });
    }

    res.status(200).json(messages);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching messages', error: error.message });
  }
};

export const updateMessageStatus = async (req, res) => {
  try {
    const { messageId } = req.params;
    const { status } = req.body;

    const message = await Message.findByIdAndUpdate(messageId, { status }, { new: true });

    if (!message) {
      return res.status(404).json({ message: 'Message not found' });
    }

    // Emit the status update to the sender
    io.to(message.sender.toString()).emit('message_status_update', { messageId, status });

    res.status(200).json(message);
  } catch (error) {
    res.status(500).json({ message: 'Error updating message status', error: error.message });
  }
};

export const forwardMessage = async (req, res) => {
  try {
    const { messageId, receiverId, receiverModel } = req.body;
    const senderId = req.user.id;

    const originalMessage = await Message.findById(messageId);
    if (!originalMessage) {
      return res.status(404).json({ message: 'Original message not found' });
    }

    const forwardedMessage = new Message({
      sender: senderId,
      receiver: receiverId,
      receiverModel,
      content: originalMessage.content,
      messageType: originalMessage.messageType,
      mediaUrl: originalMessage.mediaUrl,
      formattedContent: originalMessage.formattedContent,
      forwardedFrom: originalMessage._id,
    });

    await forwardedMessage.save();

    // Emit the forwarded message to the receiver(s)
    if (receiverModel === 'User') {
      io.to(receiverId).emit('new_message', forwardedMessage);
    } else if (receiverModel === 'Group') {
      const group = await Group.findById(receiverId);
      group.members.forEach(member => {
        if (member.user.toString() !== senderId) {
          io.to(member.user.toString()).emit('new_message', forwardedMessage);
        }
      });
    }

    res.status(201).json(forwardedMessage);
  } catch (error) {
    res.status(500).json({ message: 'Error forwarding message', error: error.message });
  }
};

export const starMessage = async (req, res) => {
  try {
    const { messageId } = req.params;
    const userId = req.user.id;

    const message = await Message.findByIdAndUpdate(messageId, { isStarred: true }, { new: true });
    if (!message) {
      return res.status(404).json({ message: 'Message not found' });
    }

    await User.findByIdAndUpdate(userId, { $addToSet: { starredMessages: messageId } });

    res.status(200).json(message);
  } catch (error) {
    res.status(500).json({ message: 'Error starring message', error: error.message });
  }
};

export const unstarMessage = async (req, res) => {
  try {
    const { messageId } = req.params;
    const userId = req.user.id;

    const message = await Message.findByIdAndUpdate(messageId, { isStarred: false }, { new: true });
    if (!message) {
      return res.status(404).json({ message: 'Message not found' });
    }

    await User.findByIdAndUpdate(userId, { $pull: { starredMessages: messageId } });

    res.status(200).json(message);
  } catch (error) {
    res.status(500).json({ message: 'Error unstarring message', error: error.message });
  }
};

export const getStarredMessages = async (req, res) => {
  try {
    const userId = req.user.id;
    const user = await User.findById(userId).populate('starredMessages');
    res.status(200).json(user.starredMessages);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching starred messages', error: error.message });
  }
};

