import { Router } from 'express';
const router = Router();
import { v4 as uuidv4 } from 'uuid';

let vehicules = [
  {
    id: '1',
    immatriculation: 'TN-1234',
    type: 'camion-benne',
    capacite: 5000,
    statut: 'disponible',
    kilometrage: 15000,
    dateMiseEnService: '2023-05-10',
    consommationMoyenne: 25.5
  },
  {
    id: '2',
    immatriculation: 'TN-5678',
    type: 'camion-compacteur',
    capacite: 8000,
    statut: 'en-maintenance',
    kilometrage: 22000,
    dateMiseEnService: '2023-03-15',
    consommationMoyenne: 30.2
  }
];

router.get('/', (req, res) => {
  res.json({ success: true, data: vehicules, total: vehicules.length });
});

router.get('/:id', (req, res) => {
  const vehicule = vehicules.find(v => v.id === req.params.id);
  if (!vehicule) {
    return res.status(404).json({ success: false, error: 'Véhicule non trouvé' });
  }
  res.json({ success: true, data: vehicule });
});

router.post('/', (req, res) => {
  const nouveauVehicule = {
    id: uuidv4(),
    ...req.body,
    dateCreation: new Date().toISOString()
  };

  vehicules.push(nouveauVehicule);
  res.status(201).json({ success: true, data: nouveauVehicule });
});

export default router;