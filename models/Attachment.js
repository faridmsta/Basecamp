'use strict';

/**
 * models/Attachment.js
 *
 * Schema:
 *   id          SERIAL PRIMARY KEY
 *   filename    VARCHAR(255) NOT NULL   -- original file name
 *   storedName  VARCHAR(255) NOT NULL   -- name on disk (uuid-based)
 *   format      VARCHAR(20)  NOT NULL   -- file extension: png/jpg/pdf/txt …
 *   mimetype    VARCHAR(100)            -- full MIME type
 *   size        INTEGER                 -- bytes
 *   projectId   INTEGER FK → projects(id) ON DELETE CASCADE
 *   userId      INTEGER FK → users(id)    ON DELETE SET NULL
 *   createdAt   TIMESTAMPTZ
 *   updatedAt   TIMESTAMPTZ
 */

const { DataTypes, Model } = require('sequelize');
const sequelize            = require('../config/database');

class Attachment extends Model {}

Attachment.init(
  {
    id: {
      type:          DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey:    true,
    },

    filename: {
      type:      DataTypes.STRING(255),
      allowNull: false,
    },

    storedName: {
      type:      DataTypes.STRING(255),
      allowNull: false,
    },

    format: {
      type:      DataTypes.STRING(20),
      allowNull: false,
    },

    mimetype: {
      type:      DataTypes.STRING(100),
      allowNull: true,
    },

    size: {
      type:      DataTypes.INTEGER,
      allowNull: true,
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
    modelName:  'Attachment',
    tableName:  'attachments',
    timestamps: true,
  }
);

module.exports = Attachment;
