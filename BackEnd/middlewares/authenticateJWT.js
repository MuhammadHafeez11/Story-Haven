const jwt = require('jsonwebtoken');

const authenticateJWT = (req, res, next) => {
  const token = req.cookies.token;

  if (!token) {
    return res.status(401).json({ message: 'Access Denied: No Token Provided!' });
  }
    
    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
      if (err) {
        return res.status(403).json({ message: 'Invalid token' });
      }

      if (user.isAdmin) {
        req.user = user; // Attach the decoded user to the req object
        next();
    } else {
        res.status(403).json({ message: 'Access denied. Admins only.' });
    }
    });
};

module.exports = authenticateJWT;
