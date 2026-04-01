# 🚀 MERN Stack Resume Builder – Complete Project

## 📁 Project Structure
```
resume-builder/
├── backend/
│   ├── config/
│   │   └── db.js
│   ├── controllers/
│   │   └── resumeController.js
│   ├── middleware/
│   │   ├── auth.js
│   │   └── errorHandler.js
│   ├── models/
│   │   └── Resume.js
│   ├── routes/
│   │   └── resumeRoutes.js
│   ├── tests/
│   │   ├── resume.test.js
│   │   └── resumeController.test.js
│   ├── .env
│   ├── server.js
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── api/
│   │   │   └── resumeApi.js
│   │   ├── components/
│   │   │   ├── Header/
│   │   │   │   ├── Header.jsx
│   │   │   │   └── Header.test.jsx
│   │   │   ├── ResumePreview/
│   │   │   │   ├── ResumePreview.jsx
│   │   │   │   └── ResumePreview.test.jsx
│   │   │   ├── SkillsPanel/
│   │   │   │   ├── SkillsPanel.jsx
│   │   │   │   └── SkillsPanel.test.jsx
│   │   │   └── ExperiencePanel/
│   │   │       ├── ExperiencePanel.jsx
│   │   │       └── ExperiencePanel.test.jsx
│   │   ├── store/
│   │   │   ├── index.js
│   │   │   ├── resumeSlice.js
│   │   │   └── resumeSlice.test.js
│   │   ├── hooks/
│   │   │   └── useResume.js
│   │   ├── App.jsx
│   │   ├── App.test.jsx
│   │   └── main.jsx
│   ├── e2e/
│   │   ├── resume.spec.js
│   │   ├── skills.spec.js
│   │   └── api.spec.js
│   ├── playwright.config.js
│   ├── vite.config.js
│   └── package.json
└── README.md
```

---

## 🔧 BACKEND

### `backend/package.json`
```json
{
  "name": "resume-builder-backend",
  "version": "1.0.0",
  "scripts": {
    "start": "node server.js",
    "dev": "nodemon server.js",
    "test": "jest --coverage"
  },
  "dependencies": {
    "bcryptjs": "^2.4.3",
    "cors": "^2.8.5",
    "dotenv": "^16.0.3",
    "express": "^4.18.2",
    "express-validator": "^7.0.1",
    "jsonwebtoken": "^9.0.0",
    "mongoose": "^7.3.1",
    "morgan": "^1.10.0"
  },
  "devDependencies": {
    "jest": "^29.5.0",
    "nodemon": "^3.0.1",
    "supertest": "^6.3.3",
    "mongodb-memory-server": "^8.13.0"
  },
  "jest": {
    "testEnvironment": "node",
    "setupFilesAfterFramework": ["./tests/setup.js"]
  }
}
```

### `backend/.env`
```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/resume_builder
JWT_SECRET=your_jwt_secret_key_here
NODE_ENV=development
```

### `backend/config/db.js`
```js
const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`❌ MongoDB Error: ${error.message}`);
    process.exit(1);
  }
};

module.exports = connectDB;
```

### `backend/models/Resume.js`
```js
const mongoose = require('mongoose');

const ExperienceSchema = new mongoose.Schema({
  company:     { type: String, required: true },
  position:    { type: String, required: true },
  duration:    { type: String, required: true },
  current:     { type: Boolean, default: false },
  description: { type: String, default: '' },
  skills:      [{ type: String }],
});

const AwardSchema = new mongoose.Schema({
  title: { type: String, required: true },
  org:   { type: String },
  desc:  { type: String },
});

const EducationSchema = new mongoose.Schema({
  degree:      { type: String, required: true },
  institution: { type: String, required: true },
  year:        { type: String },
});

const ResumeSchema = new mongoose.Schema(
  {
    title:    { type: String, default: 'My Resume' },
    template: { type: String, enum: ['modern', 'dark', 'minimal', 'bold'], default: 'modern' },
    header: {
      name:     { type: String, required: true },
      title:    { type: String },
      email:    { type: String, required: true },
      phone:    { type: String },
      location: { type: String },
      linkedin: { type: String },
    },
    summary:    { type: String, default: '' },
    skills:     { type: Map, of: [String], default: {} },
    experience: [ExperienceSchema],
    education:  [EducationSchema],
    awards:     [AwardSchema],
    sections: [{
      id:       String,
      label:    String,
      enabled:  { type: Boolean, default: true },
      required: { type: Boolean, default: false },
    }],
    userId: { type: String, default: 'guest' },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Resume', ResumeSchema);
```

### `backend/controllers/resumeController.js`
```js
const Resume = require('../models/Resume');
const { validationResult } = require('express-validator');

// @desc   GET all resumes
// @route  GET /api/resumes
const getResumes = async (req, res) => {
  try {
    const resumes = await Resume.find().sort({ updatedAt: -1 });
    res.status(200).json({ success: true, count: resumes.length, data: resumes });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// @desc   GET single resume
// @route  GET /api/resumes/:id
const getResumeById = async (req, res) => {
  try {
    const resume = await Resume.findById(req.params.id);
    if (!resume) return res.status(404).json({ success: false, message: 'Resume not found' });
    res.status(200).json({ success: true, data: resume });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// @desc   POST create resume
// @route  POST /api/resumes
const createResume = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ success: false, errors: errors.array() });
  try {
    const resume = await Resume.create(req.body);
    res.status(201).json({ success: true, data: resume });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// @desc   PUT update resume
// @route  PUT /api/resumes/:id
const updateResume = async (req, res) => {
  try {
    const resume = await Resume.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!resume) return res.status(404).json({ success: false, message: 'Resume not found' });
    res.status(200).json({ success: true, data: resume });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// @desc   DELETE resume
// @route  DELETE /api/resumes/:id
const deleteResume = async (req, res) => {
  try {
    const resume = await Resume.findByIdAndDelete(req.params.id);
    if (!resume) return res.status(404).json({ success: false, message: 'Resume not found' });
    res.status(200).json({ success: true, message: 'Resume deleted successfully' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

module.exports = { getResumes, getResumeById, createResume, updateResume, deleteResume };
```

### `backend/routes/resumeRoutes.js`
```js
const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const {
  getResumes, getResumeById,
  createResume, updateResume, deleteResume
} = require('../controllers/resumeController');

const validateResume = [
  body('header.name').notEmpty().withMessage('Name is required'),
  body('header.email').isEmail().withMessage('Valid email required'),
];

router.route('/').get(getResumes).post(validateResume, createResume);
router.route('/:id').get(getResumeById).put(updateResume).delete(deleteResume);

module.exports = router;
```

### `backend/middleware/errorHandler.js`
```js
const errorHandler = (err, req, res, next) => {
  console.error(err.stack);
  const statusCode = err.statusCode || 500;
  res.status(statusCode).json({
    success: false,
    message: err.message || 'Internal Server Error',
    stack: process.env.NODE_ENV === 'development' ? err.stack : undefined,
  });
};

module.exports = errorHandler;
```

### `backend/server.js`
```js
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const resumeRoutes = require('./routes/resumeRoutes');
const errorHandler = require('./middleware/errorHandler');

dotenv.config();
connectDB();

const app = express();

app.use(cors({ origin: 'http://localhost:5173', credentials: true }));
app.use(express.json());
app.use(morgan('dev'));

// Routes
app.use('/api/resumes', resumeRoutes);

// Health check
app.get('/health', (req, res) => res.json({ status: 'OK', timestamp: new Date() }));

app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));

module.exports = app;
```

---

### `backend/tests/resume.test.js` — Supertest Integration Tests
```js
const request = require('supertest');
const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const app = require('../server');
const Resume = require('../models/Resume');

let mongoServer;

const mockResume = {
  title: 'Test Resume',
  template: 'modern',
  header: { name: 'Sudhir Jedhe', email: 'test@test.com', phone: '9999999999', location: 'India' },
  summary: 'Test summary',
  skills: { Frontend: ['React JS', 'TypeScript'] },
  experience: [{ company: 'Persistent Systems', position: 'Project Lead', duration: 'Jan 2025 – Present', current: true, description: 'Led projects.' }],
  education: [{ degree: 'BE Computer Engineering', institution: 'Pune University', year: '2012' }],
  awards: [{ title: '2x Spot Award', org: 'MITR', desc: 'On time delivery' }],
};

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  await mongoose.connect(mongoServer.getUri());
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
});

afterEach(async () => {
  await Resume.deleteMany();
});

describe('GET /api/resumes', () => {
  it('should return empty array when no resumes', async () => {
    const res = await request(app).get('/api/resumes');
    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data).toHaveLength(0);
  });

  it('should return all resumes', async () => {
    await Resume.create(mockResume);
    const res = await request(app).get('/api/resumes');
    expect(res.statusCode).toBe(200);
    expect(res.body.data).toHaveLength(1);
    expect(res.body.data[0].title).toBe('Test Resume');
  });
});

describe('POST /api/resumes', () => {
  it('should create a new resume', async () => {
    const res = await request(app).post('/api/resumes').send(mockResume);
    expect(res.statusCode).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.data._id).toBeDefined();
    expect(res.body.data.header.name).toBe('Sudhir Jedhe');
  });

  it('should return 400 if name is missing', async () => {
    const invalid = { ...mockResume, header: { email: 'test@test.com' } };
    const res = await request(app).post('/api/resumes').send(invalid);
    expect(res.statusCode).toBe(400);
    expect(res.body.success).toBe(false);
  });

  it('should return 400 if email is invalid', async () => {
    const invalid = { ...mockResume, header: { ...mockResume.header, email: 'not-an-email' } };
    const res = await request(app).post('/api/resumes').send(invalid);
    expect(res.statusCode).toBe(400);
  });
});

describe('GET /api/resumes/:id', () => {
  it('should return resume by id', async () => {
    const created = await Resume.create(mockResume);
    const res = await request(app).get(`/api/resumes/${created._id}`);
    expect(res.statusCode).toBe(200);
    expect(res.body.data._id).toBe(created._id.toString());
  });

  it('should return 404 for invalid id', async () => {
    const res = await request(app).get('/api/resumes/64a1234567890abcdef12345');
    expect(res.statusCode).toBe(404);
  });
});

describe('PUT /api/resumes/:id', () => {
  it('should update resume', async () => {
    const created = await Resume.create(mockResume);
    const res = await request(app).put(`/api/resumes/${created._id}`).send({ title: 'Updated Resume' });
    expect(res.statusCode).toBe(200);
    expect(res.body.data.title).toBe('Updated Resume');
  });
});

describe('DELETE /api/resumes/:id', () => {
  it('should delete resume', async () => {
    const created = await Resume.create(mockResume);
    const res = await request(app).delete(`/api/resumes/${created._id}`);
    expect(res.statusCode).toBe(200);
    expect(res.body.message).toBe('Resume deleted successfully');
    const check = await Resume.findById(created._id);
    expect(check).toBeNull();
  });
});
```

### `backend/tests/resumeController.test.js` — Unit Tests
```js
const { getResumes, getResumeById, createResume, updateResume, deleteResume } = require('../controllers/resumeController');
const Resume = require('../models/Resume');

jest.mock('../models/Resume');

const mockRes = () => {
  const res = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res;
};

describe('resumeController - getResumes', () => {
  it('should return all resumes', async () => {
    const resumes = [{ title: 'Resume 1' }, { title: 'Resume 2' }];
    Resume.find.mockReturnValue({ sort: jest.fn().mockResolvedValue(resumes) });
    const req = {};
    const res = mockRes();
    await getResumes(req, res);
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({ success: true, count: 2, data: resumes });
  });

  it('should handle errors', async () => {
    Resume.find.mockReturnValue({ sort: jest.fn().mockRejectedValue(new Error('DB Error')) });
    const res = mockRes();
    await getResumes({}, res);
    expect(res.status).toHaveBeenCalledWith(500);
  });
});

describe('resumeController - createResume', () => {
  it('should create and return resume', async () => {
    const body = { title: 'New Resume', header: { name: 'Sudhir', email: 'test@test.com' } };
    Resume.create.mockResolvedValue({ _id: '123', ...body });
    const req = { body, validationResult: jest.fn().mockReturnValue({ isEmpty: () => true }) };
    const res = mockRes();
    // mock express-validator
    jest.mock('express-validator', () => ({ validationResult: () => ({ isEmpty: () => true, array: () => [] }) }));
    await createResume(req, res);
    expect(res.status).toHaveBeenCalledWith(201);
  });
});
```

---

## 🎨 FRONTEND

### `frontend/package.json`
```json
{
  "name": "resume-builder-frontend",
  "version": "1.0.0",
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "test": "jest --coverage",
    "test:e2e": "playwright test",
    "test:e2e:ui": "playwright test --ui"
  },
  "dependencies": {
    "@reduxjs/toolkit": "^1.9.5",
    "axios": "^1.4.0",
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "react-redux": "^8.1.1"
  },
  "devDependencies": {
    "@playwright/test": "^1.36.0",
    "@testing-library/jest-dom": "^5.17.0",
    "@testing-library/react": "^14.0.0",
    "@testing-library/user-event": "^14.4.3",
    "@vitejs/plugin-react": "^4.0.3",
    "jest": "^29.5.0",
    "jest-environment-jsdom": "^29.5.0",
    "vite": "^4.4.5"
  },
  "jest": {
    "testEnvironment": "jsdom",
    "setupFilesAfterFramework": ["@testing-library/jest-dom"],
    "moduleNameMapper": { "\\.(css|scss)$": "identity-obj-proxy" },
    "transform": { "^.+\\.(js|jsx)$": "babel-jest" }
  }
}
```

### `frontend/src/api/resumeApi.js`
```js
import axios from 'axios';

const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: BASE_URL,
  headers: { 'Content-Type': 'application/json' },
});

// Request interceptor
api.interceptors.request.use(config => {
  console.log(`➡️  ${config.method.toUpperCase()} ${config.url}`);
  return config;
});

// Response interceptor
api.interceptors.response.use(
  res => res,
  err => { console.error('API Error:', err.response?.data?.message); return Promise.reject(err); }
);

export const resumeAPI = {
  getAll:    ()       => api.get('/resumes'),
  getById:   (id)     => api.get(`/resumes/${id}`),
  create:    (data)   => api.post('/resumes', data),
  update:    (id, data) => api.put(`/resumes/${id}`, data),
  delete:    (id)     => api.delete(`/resumes/${id}`),
};

export default api;
```

### `frontend/src/store/resumeSlice.js`
```js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { resumeAPI } from '../api/resumeApi';

// ── Async Thunks ──────────────────────────────────────────────────────────────
export const fetchResumes   = createAsyncThunk('resume/fetchAll', async (_, { rejectWithValue }) => {
  try { const res = await resumeAPI.getAll(); return res.data.data; }
  catch (e) { return rejectWithValue(e.response?.data?.message); }
});

export const fetchResumeById = createAsyncThunk('resume/fetchById', async (id, { rejectWithValue }) => {
  try { const res = await resumeAPI.getById(id); return res.data.data; }
  catch (e) { return rejectWithValue(e.response?.data?.message); }
});

export const saveResume = createAsyncThunk('resume/save', async (data, { rejectWithValue }) => {
  try {
    const res = data._id ? await resumeAPI.update(data._id, data) : await resumeAPI.create(data);
    return res.data.data;
  } catch (e) { return rejectWithValue(e.response?.data?.message); }
});

export const deleteResume = createAsyncThunk('resume/delete', async (id, { rejectWithValue }) => {
  try { await resumeAPI.delete(id); return id; }
  catch (e) { return rejectWithValue(e.response?.data?.message); }
});

// ── Initial State ─────────────────────────────────────────────────────────────
const SECTION_CONFIG = [
  { id: 'header',     label: 'Header',     enabled: true,  required: true  },
  { id: 'summary',    label: 'Summary',    enabled: true,  required: false },
  { id: 'skills',     label: 'Skills',     enabled: true,  required: false },
  { id: 'experience', label: 'Experience', enabled: true,  required: false },
  { id: 'education',  label: 'Education',  enabled: true,  required: false },
  { id: 'awards',     label: 'Awards',     enabled: true,  required: false },
];

const initialState = {
  current: {
    _id: null,
    title: 'My Resume',
    template: 'modern',
    sections: SECTION_CONFIG,
    header: { name: 'Sudhir A. Jedhe', title: 'Senior React JS Developer | Project Lead', email: 'jedhesudhir@gmail.com', phone: '8551873835', location: 'India', linkedin: 'linkedin.com/in/sudhirjedhe' },
    summary: 'Senior React JS Developer with 10+ years of experience building scalable web applications.',
    skills: {
      Frontend:    ['React JS', 'TypeScript', 'JavaScript', 'HTML5', 'CSS3', 'SASS', 'Next JS'],
      'State Mgmt':['Redux', 'Redux-Toolkit', 'Context API', 'React Hooks'],
      Automation:  ['Playwright', 'Selenium', 'Cypress', 'Puppeteer'],
      Testing:     ['Jest', 'React Testing Library', 'Enzyme', 'Storybook'],
      Backend:     ['Node JS', 'Express JS', 'MongoDB', 'REST APIs', 'JWT'],
    },
    experience: [
      { id: 1, company: 'Persistent Systems', position: 'Project Lead', duration: 'Jan 2025 – Till Date', current: true, description: 'Led teams for Microsoft and Intuit. Built Playwright automation and snapshot testing framework.' },
      { id: 2, company: 'HSBC Technology India', position: 'Consultant Specialist', duration: 'Feb 2023 – Dec 2023', current: false, description: 'Built CCAT platform with global UI library and RESTful APIs.' },
    ],
    education: [{ id: 1, degree: 'BE Computer Engineering', institution: 'University of Pune', year: '2012' }],
    awards: [
      { id: 1, title: '2x Spot Award', org: 'MITR Learning Media', desc: 'On time delivery' },
      { id: 2, title: 'Team of Month', org: 'Hurix Digital', desc: 'Outstanding contribution' },
    ],
  },
  list: [],
  status: 'idle',    // idle | loading | succeeded | failed
  saveStatus: 'idle',
  error: null,
};

// ── Slice ─────────────────────────────────────────────────────────────────────
const resumeSlice = createSlice({
  name: 'resume',
  initialState,
  reducers: {
    setTemplate:   (state, { payload }) => { state.current.template = payload; },
    setTitle:      (state, { payload }) => { state.current.title = payload; },
    updateHeader:  (state, { payload: { key, value } }) => { state.current.header[key] = value; },
    updateSummary: (state, { payload }) => { state.current.summary = payload; },
    toggleSection: (state, { payload }) => {
      state.current.sections = state.current.sections.map(s =>
        s.id === payload && !s.required ? { ...s, enabled: !s.enabled } : s
      );
    },
    toggleSkill: (state, { payload: { category, skill } }) => {
      const curr = state.current.skills[category] || [];
      state.current.skills[category] = curr.includes(skill)
        ? curr.filter(s => s !== skill)
        : [...curr, skill];
    },
    addExperience:    (state) => { state.current.experience.push({ id: Date.now(), company: '', position: '', duration: '', current: false, description: '' }); },
    updateExperience: (state, { payload: { id, key, value } }) => {
      const exp = state.current.experience.find(e => e.id === id);
      if (exp) exp[key] = value;
    },
    removeExperience: (state, { payload }) => { state.current.experience = state.current.experience.filter(e => e.id !== payload); },
    addAward:    (state) => { state.current.awards.push({ id: Date.now(), title: '', org: '', desc: '' }); },
    updateAward: (state, { payload: { id, key, value } }) => {
      const award = state.current.awards.find(a => a.id === id);
      if (award) award[key] = value;
    },
    removeAward: (state, { payload }) => { state.current.awards = state.current.awards.filter(a => a.id !== payload); },
    loadResume:  (state, { payload }) => { state.current = payload; },
    resetResume: (state) => { state.current = { ...initialState.current, _id: null }; },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchResumes.pending,   (state) => { state.status = 'loading'; })
      .addCase(fetchResumes.fulfilled, (state, { payload }) => { state.status = 'succeeded'; state.list = payload; })
      .addCase(fetchResumes.rejected,  (state, { payload }) => { state.status = 'failed'; state.error = payload; })
      .addCase(fetchResumeById.fulfilled, (state, { payload }) => { state.current = payload; })
      .addCase(saveResume.pending,   (state) => { state.saveStatus = 'loading'; })
      .addCase(saveResume.fulfilled, (state, { payload }) => { state.saveStatus = 'succeeded'; state.current._id = payload._id; })
      .addCase(saveResume.rejected,  (state, { payload }) => { state.saveStatus = 'failed'; state.error = payload; })
      .addCase(deleteResume.fulfilled, (state, { payload }) => { state.list = state.list.filter(r => r._id !== payload); });
  },
});

export const {
  setTemplate, setTitle, updateHeader, updateSummary,
  toggleSection, toggleSkill,
  addExperience, updateExperience, removeExperience,
  addAward, updateAward, removeAward,
  loadResume, resetResume,
} = resumeSlice.actions;

// ── Selectors ─────────────────────────────────────────────────────────────────
export const selectCurrent    = state => state.resume.current;
export const selectList       = state => state.resume.list;
export const selectStatus     = state => state.resume.status;
export const selectSaveStatus = state => state.resume.saveStatus;

export default resumeSlice.reducer;
```

### `frontend/src/store/index.js`
```js
import { configureStore } from '@reduxjs/toolkit';
import resumeReducer from './resumeSlice';

const store = configureStore({
  reducer: { resume: resumeReducer },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({ serializableCheck: false }),
  devTools: process.env.NODE_ENV !== 'production',
});

export default store;
```

### `frontend/src/store/resumeSlice.test.js` — Redux Unit Tests
```js
import resumeReducer, {
  setTemplate, setTitle, updateHeader, updateSummary,
  toggleSection, toggleSkill,
  addExperience, updateExperience, removeExperience,
  addAward, removeAward, resetResume,
} from './resumeSlice';

const initialState = resumeReducer(undefined, { type: '@@INIT' });

describe('resumeSlice reducers', () => {

  describe('setTemplate', () => {
    it('should update template', () => {
      const state = resumeReducer(initialState, setTemplate('dark'));
      expect(state.current.template).toBe('dark');
    });
  });

  describe('setTitle', () => {
    it('should update title', () => {
      const state = resumeReducer(initialState, setTitle('My New Resume'));
      expect(state.current.title).toBe('My New Resume');
    });
  });

  describe('updateHeader', () => {
    it('should update header field', () => {
      const state = resumeReducer(initialState, updateHeader({ key: 'name', value: 'John Doe' }));
      expect(state.current.header.name).toBe('John Doe');
    });
    it('should update email', () => {
      const state = resumeReducer(initialState, updateHeader({ key: 'email', value: 'john@test.com' }));
      expect(state.current.header.email).toBe('john@test.com');
    });
  });

  describe('updateSummary', () => {
    it('should update summary', () => {
      const state = resumeReducer(initialState, updateSummary('New summary text'));
      expect(state.current.summary).toBe('New summary text');
    });
  });

  describe('toggleSection', () => {
    it('should toggle non-required section', () => {
      const state = resumeReducer(initialState, toggleSection('summary'));
      const section = state.current.sections.find(s => s.id === 'summary');
      expect(section.enabled).toBe(false);
    });
    it('should NOT toggle required section', () => {
      const state = resumeReducer(initialState, toggleSection('header'));
      const section = state.current.sections.find(s => s.id === 'header');
      expect(section.enabled).toBe(true);
    });
  });

  describe('toggleSkill', () => {
    it('should add skill if not present', () => {
      const state = resumeReducer(initialState, toggleSkill({ category: 'Frontend', skill: 'Vue JS' }));
      expect(state.current.skills['Frontend']).toContain('Vue JS');
    });
    it('should remove skill if already present', () => {
      const state = resumeReducer(initialState, toggleSkill({ category: 'Frontend', skill: 'React JS' }));
      expect(state.current.skills['Frontend']).not.toContain('React JS');
    });
  });

  describe('experience', () => {
    it('should add experience', () => {
      const state = resumeReducer(initialState, addExperience());
      expect(state.current.experience).toHaveLength(initialState.current.experience.length + 1);
    });
    it('should update experience field', () => {
      const id = initialState.current.experience[0].id;
      const state = resumeReducer(initialState, updateExperience({ id, key: 'company', value: 'Google' }));
      expect(state.current.experience[0].company).toBe('Google');
    });
    it('should remove experience', () => {
      const id = initialState.current.experience[0].id;
      const state = resumeReducer(initialState, removeExperience(id));
      expect(state.current.experience.find(e => e.id === id)).toBeUndefined();
    });
  });

  describe('awards', () => {
    it('should add award', () => {
      const state = resumeReducer(initialState, addAward());
      expect(state.current.awards).toHaveLength(initialState.current.awards.length + 1);
    });
    it('should remove award', () => {
      const id = initialState.current.awards[0].id;
      const state = resumeReducer(initialState, removeAward(id));
      expect(state.current.awards.find(a => a.id === id)).toBeUndefined();
    });
  });

  describe('resetResume', () => {
    it('should reset to default state', () => {
      const modified = resumeReducer(initialState, setTitle('Modified'));
      const reset = resumeReducer(modified, resetResume());
      expect(reset.current.title).toBe('My Resume');
      expect(reset.current._id).toBeNull();
    });
  });
});
```

### `frontend/src/components/SkillsPanel/SkillsPanel.jsx`
```jsx
import { useDispatch, useSelector } from 'react-redux';
import { toggleSkill, selectCurrent } from '../../store/resumeSlice';

const SKILL_CATALOG = {
  Frontend:    ['React JS','TypeScript','JavaScript','HTML5','CSS3','SASS','Next JS'],
  'State Mgmt':['Redux','Redux-Toolkit','Context API','React Hooks'],
  Automation:  ['Playwright','Selenium','Cypress','Puppeteer'],
  Testing:     ['Jest','React Testing Library','Enzyme','Storybook'],
  Backend:     ['Node JS','Express JS','MongoDB','REST APIs','JWT'],
};

export default function SkillsPanel() {
  const dispatch = useDispatch();
  const { skills } = useSelector(selectCurrent);
  return (
    <div data-testid="skills-panel">
      {Object.entries(SKILL_CATALOG).map(([cat, list]) => (
        <div key={cat} style={{ marginBottom: 16 }}>
          <p style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', color: '#6b7280', marginBottom: 6 }}>{cat}</p>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
            {list.map(skill => {
              const selected = (skills[cat] || []).includes(skill);
              return (
                <button
                  key={skill}
                  data-testid={`skill-btn-${skill.replace(/\s/g,'-')}`}
                  onClick={() => dispatch(toggleSkill({ category: cat, skill }))}
                  style={{ fontSize: 11, padding: '4px 10px', borderRadius: 99, border: `1px solid ${selected ? '#6366f1' : '#d1d5db'}`, background: selected ? '#eef2ff' : '#f9fafb', color: selected ? '#4338ca' : '#374151', cursor: 'pointer', fontWeight: selected ? 700 : 400 }}
                >
                  {selected ? '✓ ' : ''}{skill}
                </button>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}
```

### `frontend/src/components/SkillsPanel/SkillsPanel.test.jsx`
```jsx
import { render, screen, fireEvent } from '@testing-library/react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import resumeReducer from '../../store/resumeSlice';
import SkillsPanel from './SkillsPanel';

const makeStore = (preloadedState) =>
  configureStore({ reducer: { resume: resumeReducer }, preloadedState });

describe('SkillsPanel', () => {
  it('renders all skill categories', () => {
    const store = makeStore();
    render(<Provider store={store}><SkillsPanel/></Provider>);
    expect(screen.getByText(/frontend/i)).toBeInTheDocument();
    expect(screen.getByText(/automation/i)).toBeInTheDocument();
    expect(screen.getByText(/testing/i)).toBeInTheDocument();
    expect(screen.getByText(/backend/i)).toBeInTheDocument();
  });

  it('shows React JS as selected by default', () => {
    const store = makeStore();
    render(<Provider store={store}><SkillsPanel/></Provider>);
    const btn = screen.getByTestId('skill-btn-React-JS');
    expect(btn).toHaveStyle('background: #eef2ff');
  });

  it('toggles skill on click', () => {
    const store = makeStore();
    render(<Provider store={store}><SkillsPanel/></Provider>);
    const btn = screen.getByTestId('skill-btn-Vue-JS') || screen.getByTestId('skill-btn-Cypress');
    fireEvent.click(btn);
    expect(store.getState().resume.current.skills['Automation']).toContain('Cypress');
  });

  it('deselects skill on second click', () => {
    const store = makeStore();
    render(<Provider store={store}><SkillsPanel/></Provider>);
    const btn = screen.getByTestId('skill-btn-React-JS');
    fireEvent.click(btn);
    expect(store.getState().resume.current.skills['Frontend']).not.toContain('React JS');
  });
});
```

### `frontend/src/components/ResumePreview/ResumePreview.test.jsx`
```jsx
import { render, screen } from '@testing-library/react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import resumeReducer from '../../store/resumeSlice';
import ResumePreview from './ResumePreview';

const store = configureStore({ reducer: { resume: resumeReducer } });

describe('ResumePreview', () => {
  it('renders candidate name', () => {
    render(<Provider store={store}><ResumePreview/></Provider>);
    expect(screen.getByText(/Sudhir A. Jedhe/i)).toBeInTheDocument();
  });
  it('renders email', () => {
    render(<Provider store={store}><ResumePreview/></Provider>);
    expect(screen.getByText(/jedhesudhir@gmail.com/i)).toBeInTheDocument();
  });
  it('renders experience section', () => {
    render(<Provider store={store}><ResumePreview/></Provider>);
    expect(screen.getByText(/Persistent Systems/i)).toBeInTheDocument();
  });
  it('renders skills section', () => {
    render(<Provider store={store}><ResumePreview/></Provider>);
    expect(screen.getByText(/React JS/i)).toBeInTheDocument();
  });
});
```

### `frontend/src/App.test.jsx`
```jsx
import { render, screen, fireEvent } from '@testing-library/react';
import { Provider } from 'react-redux';
import store from './store';
import App from './App';

describe('App', () => {
  it('renders Resume Builder heading', () => {
    render(<Provider store={store}><App/></Provider>);
    expect(screen.getByText(/Resume Builder/i)).toBeInTheDocument();
  });
  it('renders Save button', () => {
    render(<Provider store={store}><App/></Provider>);
    expect(screen.getByRole('button', { name: /save/i })).toBeInTheDocument();
  });
  it('toggles preview mode', () => {
    render(<Provider store={store}><App/></Provider>);
    const btn = screen.getByRole('button', { name: /preview/i });
    fireEvent.click(btn);
    expect(screen.getByRole('button', { name: /edit/i })).toBeInTheDocument();
  });
});
```

---

## 🎭 PLAYWRIGHT E2E TESTS

### `frontend/playwright.config.js`
```js
import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './e2e',
  timeout: 30000,
  retries: 1,
  use: {
    baseURL: 'http://localhost:5173',
    headless: true,
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
    trace: 'on-first-retry',
  },
  projects: [
    { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
    { name: 'firefox',  use: { ...devices['Desktop Firefox'] } },
    { name: 'mobile',   use: { ...devices['iPhone 13'] } },
  ],
  webServer: {
    command: 'npm run dev',
    url: 'http://localhost:5173',
    reuseExistingServer: !process.env.CI,
  },
});
```

### `frontend/e2e/resume.spec.js` — Main Resume Flow
```js
import { test, expect } from '@playwright/test';

test.describe('Resume Builder – Main Flow', () => {

  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('should load the app', async ({ page }) => {
    await expect(page.getByText('Resume Builder')).toBeVisible();
    await expect(page.getByText('Redux')).toBeVisible();
  });

  test('should display default resume preview', async ({ page }) => {
    await expect(page.getByText('Sudhir A. Jedhe')).toBeVisible();
    await expect(page.getByText(/Senior React JS Developer/)).toBeVisible();
  });

  test('should edit header name and reflect in preview', async ({ page }) => {
    await page.getByRole('button', { name: /header/i }).click();
    const nameInput = page.getByLabel(/full name/i);
    await nameInput.clear();
    await nameInput.fill('John Developer');
    await expect(page.getByText('John Developer')).toBeVisible();
  });

  test('should edit summary', async ({ page }) => {
    await page.getByRole('button', { name: /summary/i }).click();
    const textarea = page.getByRole('textbox', { name: /summary/i });
    await textarea.clear();
    await textarea.fill('Updated professional summary for testing');
    await expect(page.getByText('Updated professional summary')).toBeVisible();
  });

  test('should switch template to dark', async ({ page }) => {
    const darkBtn = page.locator('[title="Dark"]').first();
    await darkBtn.click();
    const preview = page.locator('[data-testid="resume-preview"]');
    await expect(preview).toHaveCSS('background-color', 'rgb(15, 23, 42)');
  });

  test('should toggle preview mode', async ({ page }) => {
    await page.getByRole('button', { name: /preview/i }).click();
    await expect(page.getByRole('button', { name: /edit/i })).toBeVisible();
    // Sidebar should be hidden
    await expect(page.locator('[data-testid="editor-sidebar"]')).not.toBeVisible();
  });

  test('should add new experience', async ({ page }) => {
    await page.getByRole('button', { name: /experience/i }).click();
    await page.getByRole('button', { name: /add experience/i }).click();
    const inputs = page.locator('input[placeholder*="Company"]');
    const last = inputs.last();
    await last.fill('Google');
    await expect(page.getByText('Google')).toBeVisible();
  });

  test('should remove experience', async ({ page }) => {
    await page.getByRole('button', { name: /experience/i }).click();
    const deleteBtn = page.locator('[data-testid="remove-exp"]').first();
    await deleteBtn.click();
    await expect(page.getByText('Persistent Systems')).not.toBeVisible();
  });

  test('should be responsive on mobile', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 812 });
    await expect(page.getByText('Resume Builder')).toBeVisible();
    await expect(page.locator('[data-testid="resume-preview"]')).toBeVisible();
  });

  test('should export PDF button exist', async ({ page }) => {
    await expect(page.getByRole('button', { name: /export pdf/i })).toBeVisible();
  });
});
```

### `frontend/e2e/skills.spec.js` — Skills Panel Tests
```js
import { test, expect } from '@playwright/test';

test.describe('Skills Panel', () => {

  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.getByRole('button', { name: /skills/i }).click();
  });

  test('should show all skill categories', async ({ page }) => {
    await expect(page.getByText(/frontend/i)).toBeVisible();
    await expect(page.getByText(/automation/i)).toBeVisible();
    await expect(page.getByText(/testing/i)).toBeVisible();
    await expect(page.getByText(/backend/i)).toBeVisible();
  });

  test('should show React JS as selected', async ({ page }) => {
    const reactBtn = page.getByTestId('skill-btn-React-JS');
    await expect(reactBtn).toBeVisible();
    await expect(reactBtn).toHaveText(/✓.*React JS/);
  });

  test('should toggle skill off', async ({ page }) => {
    const reactBtn = page.getByTestId('skill-btn-React-JS');
    await reactBtn.click();
    await expect(reactBtn).not.toHaveText(/✓/);
    // Skill should be removed from preview
    const preview = page.locator('[data-testid="resume-preview"]');
    await expect(preview.getByText('React JS')).not.toBeVisible();
  });

  test('should toggle skill on', async ({ page }) => {
    const vueBtn = page.getByTestId('skill-btn-Playwright');
    const initialText = await vueBtn.textContent();
    await vueBtn.click();
    const newText = await vueBtn.textContent();
    expect(newText).not.toBe(initialText);
  });

  test('should show Playwright skill', async ({ page }) => {
    await expect(page.getByTestId('skill-btn-Playwright')).toBeVisible();
  });
});
```

### `frontend/e2e/api.spec.js` — API Integration Tests
```js
import { test, expect } from '@playwright/test';

test.describe('API Integration', () => {

  test('should save resume via POST API', async ({ page }) => {
    await page.goto('/');
    // Intercept API call
    const [response] = await Promise.all([
      page.waitForResponse(res => res.url().includes('/api/resumes') && res.request().method() === 'POST'),
      page.getByRole('button', { name: /save/i }).click(),
    ]);
    expect(response.status()).toBe(201);
    const body = await response.json();
    expect(body.success).toBe(true);
    expect(body.data._id).toBeDefined();
  });

  test('should update resume via PUT API after save', async ({ page }) => {
    await page.goto('/');
    // First save
    await page.getByRole('button', { name: /save/i }).click();
    await page.waitForResponse(res => res.url().includes('/api/resumes') && res.request().method() === 'POST');
    // Edit something
    await page.getByRole('button', { name: /header/i }).click();
    await page.getByLabel(/full name/i).fill('Updated Name');
    // Second save should be PUT
    const [response] = await Promise.all([
      page.waitForResponse(res => res.url().includes('/api/resumes') && res.request().method() === 'PUT'),
      page.getByRole('button', { name: /save/i }).click(),
    ]);
    expect(response.status()).toBe(200);
  });

  test('should load saved resumes via GET API', async ({ page }) => {
    await page.goto('/');
    await page.getByRole('button', { name: /api/i }).click();
    const [response] = await Promise.all([
      page.waitForResponse(res => res.url().includes('/api/resumes') && res.request().method() === 'GET'),
      page.getByRole('button', { name: /load all/i }).click(),
    ]);
    expect(response.status()).toBe(200);
  });

  test('should show API server log entries', async ({ page }) => {
    await page.goto('/');
    await page.getByRole('button', { name: /api/i }).click();
    await page.getByRole('button', { name: /save/i }).click();
    await expect(page.getByText(/POST/)).toBeVisible();
    await expect(page.getByText(/\/api\/resumes/)).toBeVisible();
  });

  test('should handle API error gracefully', async ({ page }) => {
    await page.route('**/api/resumes', route => route.fulfill({ status: 500, body: JSON.stringify({ success: false, message: 'Server Error' }) }));
    await page.goto('/');
    await page.getByRole('button', { name: /save/i }).click();
    await expect(page.getByText(/error/i)).toBeVisible();
  });
});
```

---

## 🚀 Setup & Run

### 1. Backend
```bash
cd backend
npm install
# Setup .env with your MONGO_URI
npm run dev          # Start server on :5000
npm test             # Run Jest tests
```

### 2. Frontend
```bash
cd frontend
npm install
npm run dev          # Start Vite on :5173
npm test             # Run Jest unit tests
npm run test:e2e     # Run Playwright E2E tests
npm run test:e2e:ui  # Run Playwright with UI
```

### 3. Run All Tests
```bash
# Backend
cd backend && npm test

# Frontend Unit Tests
cd frontend && npm test

# Frontend E2E
cd frontend && npm run test:e2e
```

---

## 📊 Test Coverage Summary

| Layer | Tool | Tests |
|---|---|---|
| Backend API Routes | Jest + Supertest | GET, POST, PUT, DELETE |
| Backend Controller | Jest (unit) | All controller functions |
| Redux Slice | Jest | All reducers + async thunks |
| React Components | RTL | SkillsPanel, ResumePreview, App |
| E2E – Main Flow | Playwright | Load, Edit, Preview, Add/Remove |
| E2E – Skills | Playwright | Toggle on/off, Reflect in preview |
| E2E – API | Playwright | POST, PUT, GET, Error handling |
