import  jwt  from 'jsonwebtoken';
import { User } from '../models/index.js'; // Added .js extension

const JWT_SECRET = process.env.JWT_SECRET;
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN;

const generateToken = (payload) => {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
};

const verifyToken = (token) => {
  return jwt.verify(token, JWT_SECRET);
};

const auth = async (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');

    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Accès refusé. Token manquant.'
      });
    }

    const decoded = verifyToken(token);
    const user = await User.findByPk(decoded.id);

    if (!user || !user.estActif) {
      return res.status(401).json({
        success: false,
        message: 'Token invalide ou utilisateur inactif.'
      });
    }

    // Update last access
    user.dernierAcces = new Date();
    await user.save();

    req.user = user;
    next();
  } catch (error) {
    res.status(401).json({
      success: false,
      message: 'Token invalide.'
    });
  }
};

const authorize = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: `Accès interdit. Rôle ${req.user.role} non autorisé.`
      });
    }
    next();
  };
};

export {
  generateToken,
  verifyToken,
  auth,
  authorize,
  JWT_SECRET
};