const jwt = require('jsonwebtoken');

module.exports = function (req, res, next) {
  const authHeader = req.header('Authorization');
  if (!authHeader) {
    return res.status(401).json({ msg: 'No token, authorization denied' });
  }

  const token = authHeader.split(' ')[1];

  // ✅ If token is hardcoded "admin-token", treat as admin
  if (token === 'admin-token') {
    req.user = {
      id: 'admin-id',
      role: 'admin',
    };
    return next();
  }

  // ✅ Else decode normal JWT token
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = { id: decoded.id, role: decoded.role };
    next();
  } catch (err) {
    res.status(401).json({ msg: 'Token is not valid' });
  }
};
