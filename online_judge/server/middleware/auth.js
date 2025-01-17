const jwt = require('jsonwebtoken');

module.exports = function(req, res, next) {
  // 獲取 token
  const token = req.header('Authorization')?.replace('Bearer ', '');

  if (!token) {
    return res.status(401).json({ message: '無訪問權限' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    res.status(401).json({ message: '無效的 token' });
  }
}; 