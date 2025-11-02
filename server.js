import express from 'express';
import cors from 'cors';
import { v4 as uuidv4 } from 'uuid';
// Import des routes
import pointsCollecteRoutes from './routes/pointsCollecte.js';
import vehiculesRoutes from './routes/vehicules.js';
import employesRoutes from './routes/employes.js';
import { router as authRoutes, authenticateToken } from './routes/auth.js';
import database from './config/database.js';




const app = express();
const PORT = process.env.PORT || 3000;
// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes publiques
app.use('/api/auth', authRoutes);

// Routes protégées
app.use('/api/points-collecte', authenticateToken, pointsCollecteRoutes);
app.use('/api/vehicules', authenticateToken, vehiculesRoutes);
app.use('/api/employes', authenticateToken, employesRoutes);

// Route de base
app.get('/', (req, res) => {
  res.json({
    message: 'Système Intelligent de Gestion des Déchets Urbains',
    version: '1.0.0',
    endpoints: {
      auth: '/api/auth',
      pointsCollecte: '/api/points-collecte',
      vehicules: '/api/vehicules',
      employes: '/api/employes',
    }
  });
});

// Gestion des erreurs
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Erreur interne du serveur' });
});

// Route 404
// Use a path-less middleware so express doesn't pass the path through path-to-regexp
app.use((req, res) => {
  res.status(404).json({ error: 'Route non trouvée' });
});

app.listen(PORT, () => {
  console.log(`🚀 Serveur démarré sur le port ${PORT}`);
  console.log(`📊 Système de gestion des déchets urbains`);
  console.log(`📍 API disponible sur: http://localhost:${PORT}`);
});