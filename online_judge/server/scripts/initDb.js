const mongoose = require('mongoose');
const User = require('../models/User');
const bcrypt = require('bcryptjs');

async function initDb() {
  try {
    // 連接數據庫
    await mongoose.connect(process.env.MONGODB_URI);

    // 創建管理員帳號
    const adminPassword = await bcrypt.hash('admin123', 10);
    await User.create({
      username: 'admin',
      password: adminPassword,
      role: 'teacher',
      email: 'admin@example.com'
    });

    console.log('Database initialized successfully');
    process.exit(0);
  } catch (error) {
    console.error('Error initializing database:', error);
    process.exit(1);
  }
}

initDb(); 