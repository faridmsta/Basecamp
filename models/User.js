'use strict';

/**
 * models/User.js
 *
 * Schema:
 *   id          SERIAL PRIMARY KEY
 *   username    VARCHAR(50) UNIQUE NOT NULL
 *   email       VARCHAR(255) UNIQUE NOT NULL
 *   password    VARCHAR(255) NOT NULL          -- bcrypt hash
 *   role        ENUM('user','admin') DEFAULT 'user'
 *   createdAt   TIMESTAMPTZ
 *   updatedAt   TIMESTAMPTZ
 */

const { DataTypes, Model } = require('sequelize');
const bcrypt               = require('bcryptjs');
const sequelize            = require('../config/database');

class User extends Model {
  // ── Instance helpers ────────────────────────────────────────

  /** Returns true if the plain-text password matches the stored hash. */
  async verifyPassword(plainText) {
    return bcrypt.compare(plainText, this.password);
  }

  /** Returns true when the user holds the admin role. */
  get isAdmin() {
    return this.role === 'admin';
  }
}

User.init(
  {
    id: {
      type:          DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey:    true,
    },

    username: {
      type:      DataTypes.STRING(50),
      allowNull: false,
      unique:    { msg: 'That username is already taken.' },
      validate: {
        notEmpty: { msg: 'Username cannot be blank.' },
        len:      { args: [3, 50], msg: 'Username must be 3–50 characters.' },
      },
    },

    email: {
      type:      DataTypes.STRING(255),
      allowNull: false,
      unique:    { msg: 'An account with that email already exists.' },
      validate: {
        isEmail:  { msg: 'Please enter a valid email address.' },
        notEmpty: { msg: 'Email cannot be blank.' },
      },
    },

    password: {
      type:      DataTypes.STRING(255),
      allowNull: false,
      validate: {
        notEmpty: { msg: 'Password cannot be blank.' },
        len:      { args: [6, 255], msg: 'Password must be at least 6 characters.' },
      },
    },

    role: {
      type:         DataTypes.ENUM('user', 'admin'),
      allowNull:    false,
      defaultValue: 'user',
      validate: {
        isIn: { args: [['user', 'admin']], msg: 'Role must be either user or admin.' },
      },
    },
  },
  {
    sequelize,
    modelName:  'User',
    tableName:  'users',
    timestamps: true,

    // ── Hooks ─────────────────────────────────────────────────
    hooks: {
      /**
       * Hash the password before every CREATE and UPDATE.
       * Only re-hashes when the field has been changed to avoid
       * double-hashing on unrelated updates.
       */
      beforeSave: async (user) => {
        if (user.changed('password')) {
          const salt   = await bcrypt.genSalt(12);
          user.password = await bcrypt.hash(user.password, salt);
        }
      },
    },

    defaultScope: {
      attributes: { exclude: ['password'] }, // never leak hash by default
    },

    scopes: {
      withPassword: { attributes: {} }, // include password for auth
    },
  }
);

module.exports = User;
