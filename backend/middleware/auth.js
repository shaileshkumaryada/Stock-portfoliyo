const jwt = require('jsonwebtoken');
const JWT_SECRET = 'your_secret_key';

function authMiddleware(req, res, next) {
  const authHeader = req.headers['authorization'];
  if(!authHeader) return res.status(401).json({message: 'Token missing'});
  const token = authHeader.split(' ')[1];
  if(!token) return res.status(401).json({message: 'Token malformed'});

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded.user;
    next();
  } catch {
    return res.status(401).json({message: 'Token invalid'});
  }
}

module.exports = authMiddleware;