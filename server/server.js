
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const User = require('./models/User');
const Report = require('./models/Report');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// --- MongoDB Connection ---
// Connecting to 'intervu_db' specifically
const MONGO_URI = "mongodb+srv://kushulala430_db_user:tGKRtgloUWGzUVjA@cluster0.6dv3f5y.mongodb.net/intervu_db?appName=Cluster0";

mongoose.connect(MONGO_URI)
  .then(() => console.log('MongoDB Connected'))
  .catch(err => console.error('MongoDB Connection Error:', err));

// --- Auth Routes ---

// Signup
app.post('/api/auth/signup', async (req, res) => {
  try {
    const { name, email, password, experience, resumeText, resumeScore } = req.body;
    
    // Check if user exists
    let user = await User.findOne({ email });
    if (user) return res.status(400).json({ msg: 'User already exists' });

    // Create new user (In production, hash password with bcrypt)
    user = new User({ name, email, password, experience, resumeText, resumeScore });
    await user.save();

    res.json({ user, msg: 'User registered successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
});

// Login
app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check user (In production, compare hash)
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ msg: 'Invalid credentials' });
    if (user.password !== password) return res.status(400).json({ msg: 'Invalid credentials' });

    res.json({ user, msg: 'Login successful' });
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
});

// --- User Routes ---

// Get Profile
app.get('/api/user/:id', async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password');
    res.json(user);
  } catch (err) {
    res.status(500).send('Server Error');
  }
});

// Update Profile
app.put('/api/user/:id', async (req, res) => {
  try {
    const { name, experience, resumeText, resumeScore } = req.body;
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { $set: { name, experience, resumeText, resumeScore } },
      { new: true }
    ).select('-password');
    res.json(user);
  } catch (err) {
    res.status(500).send('Server Error');
  }
});

// --- Report Routes ---

// Save Report
app.post('/api/reports', async (req, res) => {
  try {
    const { userId, ...reportData } = req.body;
    const report = new Report({ userId, ...reportData });
    await report.save();
    res.json(report);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
});

// Get User Reports
app.get('/api/reports/:userId', async (req, res) => {
  try {
    const reports = await Report.find({ userId: req.params.userId }).sort({ createdAt: -1 });
    res.json(reports);
  } catch (err) {
    res.status(500).send('Server Error');
  }
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
