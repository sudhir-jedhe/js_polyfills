import express from 'express';
import Company from '../models/Company';
import auth from '../middleware/auth';
import { isEmployerOrRecruiter } from '../middleware/roleCheck';

const router = express.Router();

router.post('/', [auth, isEmployerOrRecruiter], async (req, res) => {
  try {
    const newCompany = new Company({
      ...req.body,
      employees: [req.user.id],
    });
    const company = await newCompany.save();
    res.status(201).json(company);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

router.get('/', async (req, res) => {
  try {
    const companies = await Company.find();
    res.json(companies);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const company = await Company.findById(req.params.id).populate('jobs');
    if (!company) {
      return res.status(404).json({ message: 'Company not found' });
    }
    res.json(company);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

router.post('/:id/review', auth, async (req, res) => {
  try {
    const { rating, title, content } = req.body;
    const company = await Company.findById(req.params.id);
    if (!company) {
      return res.status(404).json({ message: 'Company not found' });
    }
    company.reviews.push({ user: req.user.id, rating, title, content });
    await company.save();
    res.json({ message: 'Review added successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;

