const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Question = require('../models/Question');

// 獲取所有題目
router.get('/', auth, async (req, res) => {
  try {
    const questions = await Question.find({ teacherId: req.user.id });
    res.json(questions);
  } catch (error) {
    res.status(500).json({ message: '伺服器錯誤' });
  }
});

// 在 POST 和 PUT 路由中添加驗證
const validateQuestion = (type, options) => {
  const correctAnswers = options.filter(opt => opt.isCorrect).length;
  
  if (type === 'single' && correctAnswers !== 1) {
    throw new Error('單選題必須且只能有一個正確答案');
  }
  
  if (type === 'multiple' && correctAnswers < 1) {
    throw new Error('多選題必須至少有一個正確答案');
  }
};

// 創建新題目
router.post('/', auth, async (req, res) => {
  try {
    const { question, type, options, category, difficulty } = req.body;
    
    try {
      validateQuestion(type, options);
    } catch (error) {
      return res.status(400).json({ message: error.message });
    }

    const newQuestion = new Question({
      teacherId: req.user.id,
      question,
      type,
      options,
      category,
      difficulty
    });

    await newQuestion.save();
    res.json(newQuestion);
  } catch (error) {
    res.status(500).json({ message: '伺服器錯誤' });
  }
});

// 更新題目
router.put('/:id', auth, async (req, res) => {
  try {
    const { question, options, category, difficulty } = req.body;
    
    // 驗證至少有一個正確答案
    const hasCorrectAnswer = options.some(option => option.isCorrect);
    if (!hasCorrectAnswer) {
      return res.status(400).json({ message: '必須設置至少一個正確答案' });
    }

    const updatedQuestion = await Question.findOneAndUpdate(
      { _id: req.params.id, teacherId: req.user.id },
      { question, options, category, difficulty },
      { new: true }
    );

    if (!updatedQuestion) {
      return res.status(404).json({ message: '題目不存在' });
    }

    res.json(updatedQuestion);
  } catch (error) {
    res.status(500).json({ message: '伺服器錯誤' });
  }
});

// 刪除題目
router.delete('/:id', auth, async (req, res) => {
  try {
    const question = await Question.findOneAndDelete({
      _id: req.params.id,
      teacherId: req.user.id
    });

    if (!question) {
      return res.status(404).json({ message: '題目不存在' });
    }

    res.json({ message: '題目已刪除' });
  } catch (error) {
    res.status(500).json({ message: '伺服器錯誤' });
  }
});

module.exports = router; 