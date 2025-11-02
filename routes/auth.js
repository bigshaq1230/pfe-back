import { Router } from 'express';
import { hash, compare } from 'bcryptjs';
import jwt from 'jsonwebtoken';
const { verify, sign } = jwt;
import { v4 as uuidv4 } from 'uuid';
const router = Router();
import db from '../config/database';
const JWT_SECRET = process.env.JWT_SECRET;

// Simulation de base de données utilisateurs (à remplacer par eXist-DB)
let users = [
  {
    id: '1',
    nom: 'Admin',
    email: 'admin@smartwaste.com',
    password: '$2b$10$V7A8Kd26QGWDNpdc.H5qlup0/0cuF9vZ6ZwqY4j38VKxZLz03/1gK', // password:123
    role: 'admin',
    dateCreation: '2024-01-01'
  }
];

// Middleware d'authentification
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

  if (!token) {
    return res.status(401).json({ success: false, error: 'Token d\'accès requis' });
  }

  verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ success: false, error: 'Token invalide' });
    }
    req.user = user;
    next();
  });
};

// Inscription
router.post('/register', async (req, res) => {
  try {
    const { id,nom, email, password, role = 'civilian' } = req.body;
    // Vérifier si l'utilisateur existe déjà
    const existingUser = users.find(user => user.email === email);
    if (existingUser) {
      return res.status(400).json({
        success: false,
        error: 'Un utilisateur avec cet email existe déjà'
      });
    }

    // Hacher le mot de passe
    const hashedPassword = await hash(password, 10);

    // Créer l'utilisateur
    const newUser = {
      id,
      nom,
      email,
      password: hashedPassword,
      role,
      dateCreation: new Date().toISOString()
    };

    users.push(newUser);

    // Générer le token JWT
    const token = sign(
      { id: newUser.id, email: newUser.email, role: newUser.role },
      JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.status(201).json({
      success: true,
      data: {
        user: {
          id: newUser.id,
          nom: newUser.nom,
          email: newUser.email,
          role: newUser.role
        },
        token
      }
    });

  } catch (error) {
    console.error('Erreur inscription:', error);
    res.status(500).json({ success: false, error: 'Erreur lors de l\'inscription' });
  }
});

// Connexion
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Trouver l'utilisateur
    const user = users.find(u => u.email === email);
    if (!user) {
      return res.status(401).json({
        success: false,
        error: 'Email ou mot de passe incorrect'
      });
    }

    // Vérifier le mot de passe
    const validPassword = await compare(password, user.password);
    if (!validPassword) {
      return res.status(401).json({
        success: false,
        error: 'Email ou mot de passe incorrect'
      });
    }

    // Générer le token JWT
    const token = sign(
      { id: user.id, email: user.email, role: user.role },
      JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.json({
      success: true,
      data: {
        user: {
          id: user.id,
          nom: user.nom,
          email: user.email,
          role: user.role
        },
        token
      }
    });

  } catch (error) {
    console.error('Erreur connexion:', error);
    res.status(500).json({ success: false, error: 'Erreur lors de la connexion' });
  }
});

// Profil utilisateur
router.get('/profile', authenticateToken, (req, res) => {
  const user = users.find(u => u.id === req.user.id);
  if (!user) {
    return res.status(404).json({ success: false, error: 'Utilisateur non trouvé' });
  }

  res.json({
    success: true,
    data: {
      user: {
        id: user.id,
        nom: user.nom,
        email: user.email,
        role: user.role
      }
    }
  });
});

export  { router, authenticateToken };