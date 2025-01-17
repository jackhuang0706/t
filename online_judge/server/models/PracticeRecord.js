const mongoose = require('mongoose');

const practiceRecordSchema = new mongoose.Schema({
  studentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  questionId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Question',
    required: true
  },
  selectedOptions: [{
    type: String  // 選項ID
  }],
  isCorrect: Boolean,
  attemptCount: {
    type: Number,
    default: 1
  },
  lastAttemptAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('PracticeRecord', practiceRecordSchema); 