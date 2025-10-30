import { verify } from 'jsonwebtoken';

const JWT_SECRET = 'votre_secret_jwt'; // À changer en production

const authMiddleware = (req, res, next) => {
  // Récupérer le token du header Authorization
  const authHeader = req.header('Authorization');
  if (!authHeader) {
    return res.status(401).json({ error: 'Accès refusé, token manquant' });
  }

  // Le format est "Bearer <token>"
  const token = authHeader.replace('Bearer ', '');
  if (!token) {
    return res.status(401).json({ error: 'Accès refusé, token manquant' });
  }

  try {
    const decoded = verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    res.status(400).json({ error: 'Token invalide' });
  }
};

export default authMiddleware;