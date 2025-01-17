const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

// 登入路由
router.post('/login', async (req, res) => {
  try {
    const { username, password, role } = req.body;

    // 檢查用戶是否存在
    const user = await User.findOne({ username, role });
    if (!user) {
      return res.status(400).json({ message: '用戶名或密碼錯誤' });
    }

    // 驗證密碼
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: '用戶名或密碼錯誤' });
    }

    // 創建 JWT
    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '1d' }
    );

    res.json({
      token,
      user: {
        id: user._id,
        username: user.username,
        role: user.role,
        email: user.email
      }
    });
  } catch (error) {
    res.status(500).json({ message: '伺服器錯誤' });
  }
});

// 註冊路由（僅供教師使用）
router.post('/register', async (req, res) => {
  try {
    const { username, password, email } = req.body;

    // 檢查用戶是否已存在
    let user = await User.findOne({ $or: [{ username }, { email }] });
    if (user) {
      return res.status(400).json({ message: '用戶名或郵箱已存在' });
    }

    // 創建新用戶
    user = new User({
      username,
      password,
      email,
      role: 'teacher'
    });

    // 加密密碼
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(password, salt);

    await user.save();

    // 創建 JWT
    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '1d' }
    );

    res.json({
      token,
      user: {
        id: user._id,
        username: user.username,
        role: user.role,
        email: user.email
      }
    });
  } catch (error) {
    res.status(500).json({ message: '伺服器錯誤' });
  }
});

module.exports = router; 