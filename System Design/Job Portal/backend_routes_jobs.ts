import express from 'express';
import Job from '../models/Job';
import auth from '../middleware/auth';
import { isEmployerOrRecruiter, isAdmin } from '../middleware/roleCheck';

const router = express.Router();

router.post('/', [auth, isEmployerOrRecruiter], async (req, res) => {
  try {
    const newJob = new Job({
      ...req.body,
      employer: req.user.id,
    });
    const job = await newJob.save();
    res.status(201).json(job);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

router.get('/', async (req, res) => {
  try {
    const { search, location, category, type, experienceLevel } = req.query;
    let query: any = { isApproved: true };

    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
      ];
    }
    if (location) query.location = { $regex: location, $options: 'i' };
    if (category) query.category = category;
    if (type) query.type = type;
    if (experienceLevel) query.experienceLevel = experienceLevel;

    const jobs = await Job.find(query).sort({ postedAt: -1 });
    res.json(jobs);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const job = await Job.findById(req.params.id).populate('employer', 'email');
    if (!job) {
      return res.status(404).json({ message: 'Job not found' });
    }
    res.json(job);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

router.post('/:id/apply', auth, async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);
    if (!job) {
      return res.status(404).json({ message: 'Job not found' });
    }
    if (job.applications.some(app => app.applicant.toString() === req.user.id)) {
      return res.status(400).json({ message: 'Already applied to this job' });
    }
    job.applications.push({ applicant: req.user.id });
    await job.save();
    res.json({ message: 'Application submitted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

router.put('/:id/approve', [auth, isAdmin], async (req, res) => {
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

