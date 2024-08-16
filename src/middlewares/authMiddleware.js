const jwtUtils = require('../utils/jwtUtils');
const AuthenticationError = require('../exceptions/AuthenticationError');

const authMiddleware = (req, res, next) => {
  const authHeader = req.headers.authorization;
  
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    throw new AuthenticationError('Anda tidak memiliki akses');
  }

  const token = authHeader.split(' ')[1];

  if (!token) {
    throw new AuthenticationError('Anda tidak memiliki akses');
  }

  try {
    const decoded = jwtUtils.verifyToken(token);
    req.decoded = decoded;
    next();
  } catch (error) {
    throw new AuthenticationError('Akses anda tidak valid');
  }
};

module.exports = authMiddleware;
