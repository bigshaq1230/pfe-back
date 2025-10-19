import dotenv from 'dotenv';
import { syncDatabase } from '../models';
import { User } from '../models';
dotenv.config()
const setupDatabase = async () => {
  try {
    // Sync database
    await syncDatabase(true); // force: true will drop and recreate tables

    // Create default users for testing
    const defaultUsers = [
      {
        id: 1113750,
        email: 'admin@municipalite.tn',
        password: 'admin123',
        nom: 'Admin',
        prenom: 'System',
        role: 'admin',
      },
      {
        id:2222,
        email: 'manager@municipalite.tn',
        password: 'manager123',
        nom: 'Dupont',
        prenom: 'Marie',
        role: 'gestionnaire',
      },
      {
        id:55555555,
        email: 'agent@municipalite.tn',
        password: 'agent123',
        nom: 'Martin',
        prenom: 'Jean',
        role: 'agent',

        competences: ['conduite', 'collecte']
      },
      {
        id:1223332,
        email: 'environnement@municipalite.tn',
        password: 'env123',
        nom: 'Leclerc',
        prenom: 'Sophie',
        role: 'responsable_environnement',
      }
    ];

    for (const userData of defaultUsers) {
      await User.create(userData);
    }

    console.log('✅ Database setup completed successfully');
    console.log('📋 Default users created:');
    console.log('   - Admin: admin@municipalite.tn / admin123');
    console.log('   - Manager: manager@municipalite.tn / manager123');
    console.log('   - Agent: agent@municipalite.tn / agent123');
    console.log('   - Environment: environnement@municipalite.tn / env123');

    process.exit(0);
  } catch (error) {
    console.error('❌ Database setup failed:', error);
    process.exit(1);
  }
};

setupDatabase();