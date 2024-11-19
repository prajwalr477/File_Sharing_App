import jwt from 'jsonwebtoken';

// Middleware to verify JWT token
const auth = (req, res, next) => {
  const token = req.header('Authorization')?.split(' ')[1];
  if (!token) {
    return res.status(401).json({ message: 'Access denied, token missing' });
  }

  try {
    const verified = jwt.verify(token, process.env.JWT_SECRET);
    req.user = verified;
    next(); // Pass control to the next handler
  } catch (error) {
    res.status(400).json({ message: 'Invalid or expired token' });
  }
};

export default auth;
