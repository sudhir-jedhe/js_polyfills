import Status from '../models/status.model.js';
import { uploadMedia } from '../services/media.service.js';

export const createStatus = async (req, res) => {
  try {
    const { content, statusType } = req.body;
    const userId = req.user.id;
    let mediaUrl;

    if (statusType !== 'text' && req.file) {
      mediaUrl = await uploadMedia(req.file);
    }

    const status = new Status({
      user: userId,
      content,
      statusType,
      mediaUrl,
    });

    await status.save();

    res.status(201).json(status);
  } catch (error) {
    res.status(500).json({ message: 'Error creating status', error: error.message });
  }
};

export const getStatusUpdates = async (req, res) => {
  try {
    const userId = req.user.id;

    const statuses = await Status.find({
      user: { $ne: userId },
      expiresAt: { $gt: new Date() },
    }).populate('user', 'name profilePic');

    res.status(200).json(statuses);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching status updates', error: error.message });
  }
};

export const viewStatus = async (req, res) => {
  try {
    const { statusId } = req.params;
    const userId = req.user.id;

    const status = await Status.findByIdAndUpdate(
      statusId,
      { $addToSet: { viewers: userId } },
      { new: true }
    );

    if (!status) {
      return res.status(404).json({ message: 'Status not found' });
    }

    res.status(200).json(status);
  } catch (error) {
    res.status(500).json({ message: 'Error viewing status', error: error.message });
  }
};

