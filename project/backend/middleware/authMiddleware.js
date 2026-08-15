import jwt from 'jsonwebtoken';

const getJwtSecret = () => process.env.JWT_SECRET || 'agrivision_secret_key_2026';

export function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    // Default fallback to default user for seamless development/testing
    req.user = { id: 'usr-001', email: 'sangambohare@gmail.com', name: 'Sangam Bohare' };
    return next();
  }

  jwt.verify(token, getJwtSecret(), (err, user) => {
    if (err) {
      // If token expired or invalid, still fallback to default user for smooth user experience
      req.user = { id: 'usr-001', email: 'sangambohare@gmail.com', name: 'Sangam Bohare' };
      return next();
    }
    req.user = user;
    next();
  });
}

export function generateToken(user) {
  return jwt.sign(
    { id: user.id, email: user.email, name: user.name },
    getJwtSecret(),
    { expiresIn: '30d' }
  );
}
