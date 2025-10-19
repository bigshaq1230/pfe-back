import express from 'express';
import { User } from '../models/index.js';
import { auth, authorize, generateToken } from '../middleware/auth.js';

const router = express.Router();

// @desc    Register new user
// @route   POST /api/auth/register
// @access  Private/Admin
router.post('/register', auth, authorize('admin'), async (req, res) => {
  try {
    const {
      id,
      email,
      password,
      nom,
      prenom,
      telephone,
      role,
      competences,
    } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({
      where: {
        email: email.toLowerCase()
      }
    });

    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'Un utilisateur avec cet email existe déjà.'
      });
    }

    // Check matricule uniqueness if provided
    if (matricule) {
      const existingMatricule = await User.findOne({ where: { matricule } });
      if (existingMatricule) {
        return res.status(400).json({
          success: false,
          message: 'Ce matricule est déjà utilisé.'
        });
      }
    }

    const user = await User.create({
      id,
      email: email.toLowerCase(),
      password,
      nom,
      prenom,
      telephone,
      role,
      competences: competences || []
    });

    const token = generateToken({
      id: user.id,
      email: user.email,
      role: user.role
    });

    res.status(201).json({
      success: true,
      message: 'Utilisateur créé avec succès',
      data: {
        user,
        token
      }
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(400).json({
      success: false,
      message: error.message || 'Erreur lors de la création de l\'utilisateur'
    });
  }
});

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validation
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Veuillez fournir un email et un mot de passe.'
      });
    }

    // Find user
    const user = await User.findOne({
      where: {
        email: email.toLowerCase(),
        estActif: true
      }
    });

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Email ou mot de passe incorrect.'
      });
    }

    // Check password
    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: 'Email ou mot de passe incorrect.'
      });
    }

    // Update last access
    user.dernierAcces = new Date();
    await user.save();

    // Generate token
    const token = generateToken({
      id: user.id,
      email: user.email,
      role: user.role
    });

    res.json({
      success: true,
      message: 'Connexion réussie',
      data: {
        user,
        token
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur interne du serveur'
    });
  }
});

// @desc    Get current user profile
// @route   GET /api/auth/profile
// @access  Private
router.get('/profile', auth, async (req, res) => {
  res.json({
    success: true,
    data: req.user
  });
});

// @desc    Update user profile
// @route   PUT /api/auth/profile
// @access  Private
router.put('/profile', auth, async (req, res) => {
  try {
    const allowedUpdates = ['nom', 'prenom', 'telephone'];
    const updates = {};

    Object.keys(req.body).forEach(key => {
      if (allowedUpdates.includes(key)) {
        updates[key] = req.body[key];
      }
    });

    await req.user.update(updates);

    res.json({
      success: true,
      message: 'Profil mis à jour avec succès',
      data: req.user
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
});

// @desc    Get all users (Admin only)
// @route   GET /api/auth/users
// @access  Private/Admin
router.get('/users', auth, authorize('admin'), async (req, res) => {
  try {
    const users = await User.findAll({
      attributes: { exclude: ['password'] },
      order: [['createdAt', 'DESC']]
    });

    res.json({
      success: true,
      data: users
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// @desc    Update user (Admin only)
// @route   PUT /api/auth/users/:id
// @access  Private/Admin
router.put('/users/:id', auth, authorize('admin'), async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'Utilisateur non trouvé.'
      });
    }

    const { password, ...updates } = req.body;

    // Handle password update separately
    if (password) {
      user.password = password;
      await user.save();
    }

    await user.update(updates);

    res.json({
      success: true,
      message: 'Utilisateur mis à jour avec succès',
      data: user
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
});

export default router;