const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const PracticeRecord = require('../models/PracticeRecord');
const QuizResult = require('../models/QuizResult');

// 獲取學生儀表板數據
router.get('/dashboard', auth, async (req, res) => {
  try {
    // 獲取最近的測驗結果
    const recentQuizzes = await QuizResult.find({ studentId: req.user.id })
      .sort({ completedAt: -1 })
      .limit(5)
      .populate('quizId', 'title');

    // 計算統計數據
    const allQuizResults = await QuizResult.find({ studentId: req.user.id });
    const practiceCount = await PracticeRecord.countDocuments({ studentId: req.user.id });
    
    const stats = {
      completedQuizzes: allQuizResults.length,
      averageScore: allQuizResults.length > 0 
        ? Math.round(allQuizResults.reduce((acc, curr) => acc + curr.score, 0) / allQuizResults.length)
        : 0,
      practiceQuestions: practiceCount
    };

    res.json({
      recentQuizzes,
      stats
    });
  } catch (error) {
    res.status(500).json({ message: '伺服器錯誤' });
  }
});

// 獲取練習記錄
router.get('/practice-records', auth, async (req, res) => {
  try {
    const records = await PracticeRecord.find({ studentId: req.user.id })
      .sort({ lastAttemptAt: -1 })
      .populate('questionId', 'question');
    
    res.json(records);
  } catch (error) {
    res.status(500).json({ message: '伺服器錯誤' });
  }
});

module.exports = router; 