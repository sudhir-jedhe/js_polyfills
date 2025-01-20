import mongoose from 'mongoose';

const companySchema = new mongoose.Schema({
  name: { type: String, required: true },
  logo: { type: String },
  description: { type: String },
  industry: { type: String },
  size: { type: String },
  website: { type: String },
  location: { type: String },
  foundedYear: { type: Number },
  employees: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  jobs: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Job' }],
  reviews: [{
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    rating: { type: Number, min: 1, max: 5 },
    title: { type: String },
    content: { type: String },
    createdAt: { type: Date, default: Date.now }
  }]
});

export default mongoose.model('Company', companySchema);

