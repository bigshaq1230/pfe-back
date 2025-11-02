import { Router } from 'express';
const router = Router();
import { v4 as uuidv4 } from 'uuid';

// Données temporaires (à remplacer par eXist-DB)
let pointsCollecte = [
  {
    id: '1',
    localisation: { lat: 36.8065, lng: 10.1815 },
    niveauRemplissage: 75,
    capaciteMax: 1000,
    statut: 'actif',
    dateInstallation: '2024-01-15'
  },
  {
    id: '2',
    localisation: { lat: 36.8080, lng: 10.1830 },
    niveauRemplissage: 30,
    capaciteMax: 800,
    statut: 'actif',
    dateInstallation: '2024-01-20'
  }
];

// GET tous les points de collecte
router.get('/', (req, res) => {
  res.json({
    success: true,
    data: pointsCollecte,
    total: pointsCollecte.length
  });
});

// GET un point de collecte par ID
router.get('/:id', (req, res) => {
  const point = pointsCollecte.find(p => p.id === req.params.id);
  if (!point) {
    return res.status(404).json({ success: false, error: 'Point de collecte non trouvé' });
  }
  res.json({ success: true, data: point });
});

// POST créer un nouveau point de collecte
router.post('/', (req, res) => {
  const nouveauPoint = {
    id: uuidv4(),
    ...req.body,
    dateCreation: new Date().toISOString()
  };

  pointsCollecte.push(nouveauPoint);
  res.status(201).json({ success: true, data: nouveauPoint });
});

// PUT mettre à jour un point de collecte
router.put('/:id', (req, res) => {
  const index = pointsCollecte.findIndex(p => p.id === req.params.id);
  if (index === -1) {
    return res.status(404).json({ success: false, error: 'Point de collecte non trouvé' });
  }

  pointsCollecte[index] = { ...pointsCollecte[index], ...req.body };
  res.json({ success: true, data: pointsCollecte[index] });
});

// DELETE supprimer un point de collecte
router.delete('/:id', (req, res) => {
  const index = pointsCollecte.findIndex(p => p.id === req.params.id);
  if (index === -1) {
    return res.status(404).json({ success: false, error: 'Point de collecte non trouvé' });
  }

  pointsCollecte.splice(index, 1);
  res.json({ success: true, message: 'Point de collecte supprimé' });
});

// GET points de collecte par type de déchet
router.get('/type/:typeDechet', (req, res) => {
  const points = pointsCollecte.filter(p =>
    p.typeDechet === req.params.typeDechet
  );
  res.json({ success: true, data: points, total: points.length });
});

export default router;