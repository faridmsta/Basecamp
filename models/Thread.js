'use strict';

/**
 * models/Thread.js
 *
 * Schema:
 *   id          SERIAL PRIMARY KEY
 *   title       VARCHAR(200) NOT NULL
 *   projectId   INTEGER FK → projects(id) ON DELETE CASCADE
 *   userId      INTEGER FK → users(id)    ON DELETE SET NULL (creator / admin)
 *   createdAt   TIMESTAMPTZ
 *   updatedAt   TIMESTAMPTZ
 */

const { DataTypes, Model } = require('sequelize');
const sequelize            = require('../config/database');

class Thread extends Model {}

Thread.init(
  {
    id: {
      type:          DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey:    true,
    },

    title: {
      type:      DataTypes.STRING(200),
      allowNull: false,
      validate: {
        notEmpty: { msg: 'Thread title cannot be blank.' },
        len:      { args: [2, 200], msg: 'Thread title must be 2–200 characters.' },
      },
    },

    projectId: {
      type:      DataTypes.INTEGER,
      allowNull: false,
    },

    userId: {
      type:      DataTypes.INTEGER,
      allowNull: true,
    },
  },
  {
    sequelize,
    modelName:  'Thread',
    tableName:  'threads',
    timestamps: true,
  }
);

module.exports = Thread;
