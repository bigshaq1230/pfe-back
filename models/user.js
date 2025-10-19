import { DataTypes } from "sequelize";
import { sequelize } from "../config/database.js";
import bcrypt from "bcryptjs";
const User = sequelize.define("User", {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    validate: {
      isEmail: true,
    },
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      len: [6, 100],
    },
  },
  nom: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notEmpty: true,
    },
  },
  prenom: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notEmpty: true,
    },
  },
  telephone: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  role: {
    type: DataTypes.ENUM(
      "admin",
      "gestionnaire",
      "agent",
      "responsable_environnement",
    ),
    allowNull: false,
    defaultValue: "agent",
  },
  competences: {
    type: DataTypes.ARRAY(DataTypes.STRING),
    defaultValue: [],
  },

  disponibilite: {
    type: DataTypes.ENUM("disponible", "en_congé", "malade", "en_mission"),
    defaultValue: "disponible",
  },
  estActif: {
    type: DataTypes.BOOLEAN,
    defaultValue: true,
  },
  dernierAcces: {
    type: DataTypes.DATE,
    allowNull: true,
  },
}, {
  timestamps : true,
  tableName: "users",
  hooks: {
    beforeSave: async (user) => {
      if (user.changed("password")) {
        const salt = await bcrypt.genSalt(12);
        user.password = await bcrypt.hash(user.password, salt);
      }
    },
  },
});

// Instance methods
User.prototype.comparePassword = async function (candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

User.prototype.toJSON = function () {
  const values = { ...this.get() };
  delete values.password;
  return values;
};

// Virtual for full name
User.prototype.getNomComplet = function () {
  return `${this.prenom} ${this.nom}`;
};

export default User;
