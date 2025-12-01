
const mongoose = require('mongoose');

const TranscriptItemSchema = new mongoose.Schema({
  role: String,
  text: String,
  timestamp: Date,
});

const ReportSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  company: String,
  role: String,
  date: String,
  technicalScore: Number,
  behaviorScore: Number,
  confidenceScore: Number,
  selected: Boolean,
  feedback: String,
  strengths: [String],
  weaknesses: [String],
  transcript: [TranscriptItemSchema],
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Report', ReportSchema);
