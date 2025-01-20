import express from 'express';
import Profile from '../models/Profile';
import Job from '../models/Job';
import auth from '../middleware/auth';

const router = express.Router();

router.post('/', auth, async (req, res) => {
  try {
    let profile = await Profile.findOne({ user: req.user.id });
    if (profile) {
      profile = await Profile.findOneAndUpdate(
        { user: req.user.id },
        { $set: req.body },
        { new: true }
      );
    } else {
      profile = new Profile({
        user: req.user.id,
        ...req.body,
      });
      await profile.save();
    }
    res.json(profile);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

router.get('/me', auth, async (req, res) => {
  try {
    const profile = await Profile.findOne({ user: req.user.id });
    if (!profile) {
      return res.status(404).json({ message: 'Profile not found' });
    }
    res.json(profile);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const profile = await Profile.findOne({ user: req.params.id });
    if (!profile) {
      return res.status(404).json({ message: 'Profile not found' });
    }
    res.json(profile);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

router.post('/save-job/:jobId', auth, async (req, res) => {
  try {
    const profile = await Profile.findOne({ user: req.user.id });
    if (!profile) {
      return res.status(404).json({ message: 'Profile not found' });
    }
    if (profile.savedJobs.includes(req.params.jobId)) {
      return res.status(400).json({ message: 'Job already saved' });
    }
    profile.savedJobs.push(req.params.jobId);
    await profile.save();
    res.json({ message: 'Job saved successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

router.delete('/unsave-job/:jobId', auth, async (req, res) => {
  try {
    const profile = await Profile.findOne({ user: req.user.id });
    if (!profile) {
      return res.status(404).json({ message: 'Profile not found' });
    }
    const index = profile.savedJobs.indexOf(req.params.jobId);
    if (index === -1) {
      return res.status(400).json({ message: 'Job not saved' });
    }
    profile.savedJobs.splice(index, 1);
    await profile.save();
    res.json({ message: 'Job removed from saved jobs' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;

