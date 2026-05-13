'use strict';

/**
 * models/Project.js
 *
 * Schema:
 *   id          SERIAL PRIMARY KEY
 *   name        VARCHAR(100) NOT NULL
 *   description TEXT
 *   status      ENUM('active','archived','completed') DEFAULT 'active'
 *   userId      INTEGER FK → users(id) ON DELETE CASCADE
 *   createdAt   TIMESTAMPTZ
 *   updatedAt   TIMESTAMPTZ
 */

const { DataTypes, Model } = require('sequelize');
const sequelize            = require('../config/database');

class Project extends Model {}

Project.init(
  {
    id: {
      type:          DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey:    true,
    },

    name: {
      type:      DataTypes.STRING(100),
      allowNull: false,
      validate: {
        notEmpty: { msg: 'Project name cannot be blank.' },
        len:      { args: [2, 100], msg: 'Project name must be 2–100 characters.' },
      },
    },

    description: {
      type:      DataTypes.TEXT,
      allowNull: true,
    },

    status: {
      type:         DataTypes.ENUM('active', 'archived', 'completed'),
      allowNull:    false,
      defaultValue: 'active',
      validate: {
        isIn: { args: [['active', 'archived', 'completed']], msg: 'Invalid status value.' },
      },
    },

    userId: {
      type:      DataTypes.INTEGER,
      allowNull: false,
    },
  },
  {
    sequelize,
    modelName:  'Project',
    tableName:  'projects',
    timestamps: true,
  }
);

module.exports = Project;
