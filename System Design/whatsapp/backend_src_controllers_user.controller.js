import User from '../models/user.model.js';
import { uploadMedia } from '../services/media.service.js';

export const getProfile = async (req, res) => {
  try {
    const userId = req.user.id;
    const user = await User.findById(userId).select('-phoneNumber');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching user profile', error: error.message });
  }
};

export const updateProfile = async (req, res) => {
  try {
    const userId = req.user.id;
    const { name, status } = req.body;
    let profilePic;

    if (req.file) {
      profilePic = await uploadMedia(req.file);
    }

    const user = await User.findByIdAndUpdate(
      userId,
      { name, status, ...(profilePic && { profilePic }) },
      { new: true }
    ).select('-phoneNumber');

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: 'Error updating user profile', error: error.message });
  }
};

export const addContact = async (req, res) => {
  try {
    const userId = req.user.id;
    const { contactId } = req.body;

    const user = await User.findByIdAndUpdate(
      userId,
      { $addToSet: { contacts: contactId } },
      { new: true }
    ).select('-phoneNumber');

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: 'Error adding contact', error: error.message });
  }
};

export const removeContact = async (req, res) => {
  try {
    const userId = req.user.id;
    const { contactId } = req.body;

    const user = await User.findByIdAndUpdate(
      userId,
      { $pull: { contacts: contactId } },
      { new: true }
    ).select('-phoneNumber');

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: 'Error removing contact', error: error.message });
  }
};

export const getContacts = async (req, res) => {
  try {
    const userId = req.user.id;
    const user = await User.findById(userId).populate('contacts', 'name profilePic status');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.status(200).json(user.contacts);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching contacts', error: error.message });
  }
};

export const addAccount = async (req, res) => {
  try {
    const userId = req.user.id;
    const { accountId } = req.body;

    const user = await User.findByIdAndUpdate(
      userId,
      { $addToSet: { accounts: accountId } },
      { new: true }
    ).select('-phoneNumber');

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: 'Error adding account', error: error.message });
  }
};

export const removeAccount = async (req, res) => {
  try {
    const userId = req.user.id;
    const { accountId } = req.body;

    const user = await User.findByIdAndUpdate(
      userId,
      { $pull: { accounts: accountId } },
      { new: true }
    ).select('-phoneNumber');

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: 'Error removing account', error: error.message });
  }
};

export const getAccounts = async (req, res) => {
  try {
    const userId = req.user.id;
    const user = await User.findById(userId).populate('accounts', 'name profilePic');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.status(200).json(user.accounts);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching accounts', error: error.message });
  }
};

