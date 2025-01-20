import Group from '../models/group.model.js';
import User from '../models/user.model.js';
import { uploadMedia } from '../services/media.service.js';

export const createGroup = async (req, res) => {
  try {
    const { name, description, members } = req.body;
    const createdBy = req.user.id;
    let profilePic;

    if (req.file) {
      profilePic = await uploadMedia(req.file);
    }

    const group = new Group({
      name,
      description,
      profilePic,
      members: [{ user: createdBy, role: 'admin' }, ...members.map(m => ({ user: m }))],
      createdBy,
    });

    await group.save();

    res.status(201).json(group);
  } catch (error) {
    res.status(500).json({ message: 'Error creating group', error: error.message });
  }
};

export const getGroup = async (req, res) => {
  try {
    const { groupId } = req.params;
    const group = await Group.findById(groupId).populate('members.user', 'name profilePic');
    if (!group) {
      return res.status(404).json({ message: 'Group not found' });
    }
    res.status(200).json(group);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching group', error: error.message });
  }
};

export const updateGroup = async (req, res) => {
  try {
    const { groupId } = req.params;
    const { name, description } = req.body;
    let profilePic;

    if (req.file) {
      profilePic = await uploadMedia(req.file);
    }

    const group = await Group.findByIdAndUpdate(
      groupId,
      { name, description, ...(profilePic && { profilePic }) },
      { new: true }
    );

    if (!group) {
      return res.status(404).json({ message: 'Group not found' });
    }

    res.status(200).json(group);
  } catch (error) {
    res.status(500).json({ message: 'Error updating group', error: error.message });
  }
};

export const deleteGroup = async (req, res) => {
  try {
    const { groupId } = req.params;
    const group = await Group.findByIdAndDelete(groupId);
    if (!group) {
      return res.status(404).json({ message: 'Group not found' });
    }
    res.status(200).json({ message: 'Group deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting group', error: error.message });
  }
};

export const addMember = async (req, res) => {
  try {
    const { groupId, userId } = req.body;
    const group = await Group.findByIdAndUpdate(
      groupId,
      { $addToSet: { members: { user: userId } } },
      { new: true }
    );
    if (!group) {
      return res.status(404).json({ message: 'Group not found' });
    }
    res.status(200).json(group);
  } catch (error) {
    res.status(500).json({ message: 'Error adding member to group', error: error.message });
  }
};

export const removeMember = async (req, res) => {
  try {
    const { groupId, userId } = req.body;
    const group = await Group.findByIdAndUpdate(
      groupId,
      { $pull: { members: { user: userId } } },
      { new: true }
    );
    if (!group) {
      return res.status(404).json({ message: 'Group not found' });
    }
    res.status(200).json(group);
  } catch (error) {
    res.status(500).json({ message: 'Error removing member from group', error: error.message });
  }
};

