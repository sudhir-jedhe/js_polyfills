import express from 'express';
import User from '../models/User';
import Job from '../models/Job';
import auth from '../middleware/auth';
import { isAdmin } from '../middleware/roleCheck';

const router = express.Router();

router.get('/users', [auth, isAdmin], async (req, res) => {
  try {
    const users = await User.find().select('-password');
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

router.put('/users/:id/verify', [auth, isAdmin], async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    user.isVerified = true;
    await user.save();
    res.json({ message: 'User verified successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

router.get('/jobs/pending', [auth, isAdmin], async (req, res) => {
  try {
    const jobs = await Job.find({ isApproved: false });
    res.json(jobs);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

router.put('/jobs/:id/approve', [auth, isAdmin], async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);
    if (!job) {
      return res.status(404).json({ message: 'Job not found' });
    }
    job.isApproved = true;
    await job.save();
    res.json({ message: 'Job approved successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;

