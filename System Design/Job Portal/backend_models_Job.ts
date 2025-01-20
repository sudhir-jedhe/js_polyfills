import mongoose from 'mongoose';

const jobSchema = new mongoose.Schema({
  employer: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  title: { type: String, required: true },
  company: { type: String, required: true },
  location: { type: String, required: true },
  description: { type: String, required: true },
  requirements: [{ type: String }],
  responsibilities: [{ type: String }],
  salary: { type: String },
  type: { type: String, enum: ['Full-time', 'Part-time', 'Contract', 'Internship'] },
  category: { type: String },
  experienceLevel: { type: String },
  postedAt: { type: Date, default: Date.now },
  expiresAt: { type: Date },
  applications: [{
    applicant: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    status: { type: String, enum: ['pending', 'reviewed', 'shortlisted', 'rejected', 'hired'], default: 'pending' },
    appliedAt: { type: Date, default: Date.now }
  }],
  isApproved: { type: Boolean, default: false },
});

export default mongoose.model('Job', jobSchema);

