import { Router } from 'express';
import { v4 as uuidv4 } from 'uuid';
const router = Router();

// Données temporaires des employés (à remplacer par eXist-DB)
let employes = [
  {
    id: '1',
    matricule: 'EMP001',
    nom: 'Ben Ali',
    prenom: 'Mohamed',
    email: 'mohamed.benali@smartwaste.com',
    telephone: '+216 12 345 678',
    poste: 'chauffeur',
    specialite: ['collecte-ordures', 'conduite-poids-lourd'],
    statut: 'actif',
    dateEmbauche: '2023-01-15',
    salaire: 1800,
    zoneAffectation: 'Nord',
    disponibilite: 'disponible',
    permis: ['B', 'C'],
    dateCreation: '2024-01-15T10:00:00Z',
    dateModification: '2024-01-15T10:00:00Z'
  },
  {
    id: '2',
    matricule: 'EMP002',
    nom: 'Trabelsi',
    prenom: 'Fatma',
    email: 'fatma.trabelsi@smartwaste.com',
    telephone: '+216 23 456 789',
    poste: 'agent-collecte',
    specialite: ['tri-dechets', 'relation-client'],
    statut: 'actif',
    dateEmbauche: '2023-03-20',
    salaire: 1500,
    zoneAffectation: 'Centre',
    disponibilite: 'en-congé',
    permis: ['B'],
    dateCreation: '2024-01-15T10:00:00Z',
    dateModification: '2024-01-15T10:00:00Z'
  },
  {
    id: '3',
    matricule: 'EMP003',
    nom: 'Karray',
    prenom: 'Ali',
    email: 'ali.karray@smartwaste.com',
    telephone: '+216 34 567 890',
    poste: 'technicien-maintenance',
    specialite: ['maintenance-conteneurs', 'reparation-vehicules'],
    statut: 'actif',
    dateEmbauche: '2022-11-10',
    salaire: 2000,
    zoneAffectation: 'Toutes zones',
    disponibilite: 'disponible',
    permis: ['B', 'C'],
    dateCreation: '2024-01-15T10:00:00Z',
    dateModification: '2024-01-15T10:00:00Z'
  }
];

// GET - Récupérer tous les employés avec pagination et filtres
router.get('/', (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      statut,
      poste,
      zone,
      disponibilite,
      search
    } = req.query;

    let employesFiltres = [...employes];

    // Appliquer les filtres
    if (statut) {
      employesFiltres = employesFiltres.filter(emp => emp.statut === statut);
    }

    if (poste) {
      employesFiltres = employesFiltres.filter(emp => emp.poste === poste);
    }

    if (zone) {
      employesFiltres = employesFiltres.filter(emp =>
        emp.zoneAffectation.toLowerCase().includes(zone.toLowerCase())
      );
    }

    if (disponibilite) {
      employesFiltres = employesFiltres.filter(emp =>
        emp.disponibilite === disponibilite
      );
    }

    if (search) {
      const searchLower = search.toLowerCase();
      employesFiltres = employesFiltres.filter(emp =>
        emp.nom.toLowerCase().includes(searchLower) ||
        emp.prenom.toLowerCase().includes(searchLower) ||
        emp.matricule.toLowerCase().includes(searchLower) ||
        emp.email.toLowerCase().includes(searchLower)
      );
    }

    // Pagination
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;
    const employesPagines = employesFiltres.slice(startIndex, endIndex);

    // Métadonnées de pagination
    const pagination = {
      currentPage: parseInt(page),
      totalPages: Math.ceil(employesFiltres.length / limit),
      totalEmployes: employesFiltres.length,
      hasNext: endIndex < employesFiltres.length,
      hasPrev: startIndex > 0
    };

    res.json({
      success: true,
      data: employesPagines,
      pagination,
      total: employesFiltres.length
    });
  } catch (error) {
    console.error('Erreur lors de la récupération des employés:', error);
    res.status(500).json({
      success: false,
      error: 'Erreur lors de la récupération des employés'
    });
  }
});

// GET - Récupérer un employé par ID
router.get('/:id', (req, res) => {
  try {
    const employe = employes.find(emp => emp.id === req.params.id);

    if (!employe) {
      return res.status(404).json({
        success: false,
        error: 'Employé non trouvé'
      });
    }

    res.json({
      success: true,
      data: employe
    });
  } catch (error) {
    console.error('Erreur lors de la récupération de l\'employé:', error);
    res.status(500).json({
      success: false,
      error: 'Erreur lors de la récupération de l\'employé'
    });
  }
});

// GET - Récupérer les employés par poste
router.get('/poste/:poste', (req, res) => {
  try {
    const employesParPoste = employes.filter(emp =>
      emp.poste === req.params.poste && emp.statut === 'actif'
    );

    res.json({
      success: true,
      data: employesParPoste,
      total: employesParPoste.length,
      poste: req.params.poste
    });
  } catch (error) {
    console.error('Erreur lors de la récupération des employés par poste:', error);
    res.status(500).json({
      success: false,
      error: 'Erreur lors de la récupération des employés par poste'
    });
  }
});

// GET - Récupérer les employés disponibles
router.get('/disponibilite/:disponibilite', (req, res) => {
  try {
    const employesDisponibles = employes.filter(emp =>
      emp.disponibilite === req.params.disponibilite && emp.statut === 'actif'
    );

    res.json({
      success: true,
      data: employesDisponibles,
      total: employesDisponibles.length,
      disponibilite: req.params.disponibilite
    });
  } catch (error) {
    console.error('Erreur lors de la récupération des employés disponibles:', error);
    res.status(500).json({
      success: false,
      error: 'Erreur lors de la récupération des employés disponibles'
    });
  }
});

// POST - Créer un nouvel employé
router.post('/', (req, res) => {
  try {
    const {
      nom,
      prenom,
      email,
      telephone,
      poste,
      specialite = [],
      dateEmbauche,
      salaire,
      zoneAffectation,
      permis = []
    } = req.body;

    // Validation des champs obligatoires
    if (!nom || !prenom || !email || !poste || !dateEmbauche) {
      return res.status(400).json({
        success: false,
        error: 'Les champs nom, prenom, email, poste et dateEmbauche sont obligatoires'
      });
    }

    // Vérifier si l'email existe déjà
    const emailExiste = employes.some(emp => emp.email === email);
    if (emailExiste) {
      return res.status(400).json({
        success: false,
        error: 'Un employé avec cet email existe déjà'
      });
    }

    // Générer un matricule unique
    const dernierMatricule = employes.reduce((max, emp) => {
      const num = parseInt(emp.matricule.replace('EMP', ''));
      return num > max ? num : max;
    }, 0);
    const nouveauMatricule = `EMP${String(dernierMatricule + 1).padStart(3, '0')}`;

    const nouvelEmploye = {
      id: uuidv4(),
      matricule: nouveauMatricule,
      nom,
      prenom,
      email,
      telephone: telephone || '',
      poste,
      specialite: Array.isArray(specialite) ? specialite : [specialite],
      statut: 'actif',
      dateEmbauche,
      salaire: salaire || 0,
      zoneAffectation: zoneAffectation || 'Non affecté',
      disponibilite: 'disponible',
      permis: Array.isArray(permis) ? permis : [permis],
      dateCreation: new Date().toISOString(),
      dateModification: new Date().toISOString()
    };

    employes.push(nouvelEmploye);

    res.status(201).json({
      success: true,
      message: 'Employé créé avec succès',
      data: nouvelEmploye
    });
  } catch (error) {
    console.error('Erreur lors de la création de l\'employé:', error);
    res.status(500).json({
      success: false,
      error: 'Erreur lors de la création de l\'employé'
    });
  }
});

// PUT - Mettre à jour un employé
router.put('/:id', (req, res) => {
  try {
    const employeIndex = employes.findIndex(emp => emp.id === req.params.id);

    if (employeIndex === -1) {
      return res.status(404).json({
        success: false,
        error: 'Employé non trouvé'
      });
    }

    const { email, ...updateData } = req.body;

    // Vérifier si l'email existe déjà pour un autre employé
    if (email && email !== employes[employeIndex].email) {
      const emailExiste = employes.some(emp =>
        emp.email === email && emp.id !== req.params.id
      );
      if (emailExiste) {
        return res.status(400).json({
          success: false,
          error: 'Un employé avec cet email existe déjà'
        });
      }
    }

    // Mettre à jour l'employé
    employes[employeIndex] = {
      ...employes[employeIndex],
      ...updateData,
      dateModification: new Date().toISOString()
    };

    // Si l'email est fourni, le mettre à jour
    if (email) {
      employes[employeIndex].email = email;
    }

    res.json({
      success: true,
      message: 'Employé mis à jour avec succès',
      data: employes[employeIndex]
    });
  } catch (error) {
    console.error('Erreur lors de la mise à jour de l\'employé:', error);
    res.status(500).json({
      success: false,
      error: 'Erreur lors de la mise à jour de l\'employé'
    });
  }
});

// PATCH - Mettre à jour partiellement un employé (statut, disponibilité)
router.patch('/:id', (req, res) => {
  try {
    const employeIndex = employes.findIndex(emp => emp.id === req.params.id);

    if (employeIndex === -1) {
      return res.status(404).json({
        success: false,
        error: 'Employé non trouvé'
      });
    }

    const { statut, disponibilite, zoneAffectation } = req.body;

    // Mettre à jour seulement les champs fournis
    if (statut) employes[employeIndex].statut = statut;
    if (disponibilite) employes[employeIndex].disponibilite = disponibilite;
    if (zoneAffectation) employes[employeIndex].zoneAffectation = zoneAffectation;

    employes[employeIndex].dateModification = new Date().toISOString();

    res.json({
      success: true,
      message: 'Employé mis à jour partiellement avec succès',
      data: employes[employeIndex]
    });
  } catch (error) {
    console.error('Erreur lors de la mise à jour partielle de l\'employé:', error);
    res.status(500).json({
      success: false,
      error: 'Erreur lors de la mise à jour partielle de l\'employé'
    });
  }
});

// DELETE - Supprimer un employé (changement de statut)
router.delete('/:id', (req, res) => {
  try {
    const employeIndex = employes.findIndex(emp => emp.id === req.params.id);

    if (employeIndex === -1) {
      return res.status(404).json({
        success: false,
        error: 'Employé non trouvé'
      });
    }

    // Au lieu de supprimer, on change le statut
    employes[employeIndex].statut = 'inactif';
    employes[employeIndex].disponibilite = 'non-disponible';
    employes[employeIndex].dateModification = new Date().toISOString();

    res.json({
      success: true,
      message: 'Employé désactivé avec succès',
      data: employes[employeIndex]
    });
  } catch (error) {
    console.error('Erreur lors de la désactivation de l\'employé:', error);
    res.status(500).json({
      success: false,
      error: 'Erreur lors de la désactivation de l\'employé'
    });
  }
});

// GET - Statistiques des employés
router.get('/statistiques/general', (req, res) => {
  try {
    const totalEmployes = employes.length;
    const employesActifs = employes.filter(emp => emp.statut === 'actif').length;
    const employesInactifs = employes.filter(emp => emp.statut === 'inactif').length;

    // Répartition par poste
    const repartitionPoste = employes.reduce((acc, emp) => {
      acc[emp.poste] = (acc[emp.poste] || 0) + 1;
      return acc;
    }, {});

    // Répartition par disponibilité
    const repartitionDisponibilite = employes.reduce((acc, emp) => {
      acc[emp.disponibilite] = (acc[emp.disponibilite] || 0) + 1;
      return acc;
    }, {});

    // Répartition par zone
    const repartitionZone = employes.reduce((acc, emp) => {
      acc[emp.zoneAffectation] = (acc[emp.zoneAffectation] || 0) + 1;
      return acc;
    }, {});

    res.json({
      success: true,
      data: {
        total: totalEmployes,
        actifs: employesActifs,
        inactifs: employesInactifs,
        tauxActivation: ((employesActifs / totalEmployes) * 100).toFixed(2),
        repartitionPoste,
        repartitionDisponibilite,
        repartitionZone
      }
    });
  } catch (error) {
    console.error('Erreur lors de la récupération des statistiques:', error);
    res.status(500).json({
      success: false,
      error: 'Erreur lors de la récupération des statistiques'
    });
  }
});

// POST - Recherche avancée des employés
router.post('/recherche', (req, res) => {
  try {
    const { criteres, page = 1, limit = 10 } = req.body;

    let resultats = [...employes];

    // Appliquer les critères de recherche
    if (criteres) {
      if (criteres.nom) {
        resultats = resultats.filter(emp =>
          emp.nom.toLowerCase().includes(criteres.nom.toLowerCase()) ||
          emp.prenom.toLowerCase().includes(criteres.nom.toLowerCase())
        );
      }

      if (criteres.poste) {
        resultats = resultats.filter(emp => emp.poste === criteres.poste);
      }

      if (criteres.specialite) {
        resultats = resultats.filter(emp =>
          emp.specialite.includes(criteres.specialite)
        );
      }

      if (criteres.zoneAffectation) {
        resultats = resultats.filter(emp =>
          emp.zoneAffectation === criteres.zoneAffectation
        );
      }

      if (criteres.permis) {
        resultats = resultats.filter(emp =>
          emp.permis.includes(criteres.permis)
        );
      }

      if (criteres.statut) {
        resultats = resultats.filter(emp => emp.statut === criteres.statut);
      }

      if (criteres.disponibilite) {
        resultats = resultats.filter(emp => emp.disponibilite === criteres.disponibilite);
      }
    }

    // Pagination
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;
    const resultatsPagines = resultats.slice(startIndex, endIndex);

    const pagination = {
      currentPage: parseInt(page),
      totalPages: Math.ceil(resultats.length / limit),
      totalResultats: resultats.length,
      hasNext: endIndex < resultats.length,
      hasPrev: startIndex > 0
    };

    res.json({
      success: true,
      data: resultatsPagines,
      pagination,
      total: resultats.length
    });
  } catch (error) {
    console.error('Erreur lors de la recherche des employés:', error);
    res.status(500).json({
      success: false,
      error: 'Erreur lors de la recherche des employés'
    });
  }
});

export default router;