'use strict';

/**
 * models/Message.js
 *
 * Schema:
 *   id          SERIAL PRIMARY KEY
 *   body        TEXT NOT NULL
 *   threadId    INTEGER FK → threads(id) ON DELETE CASCADE
 *   userId      INTEGER FK → users(id)   ON DELETE SET NULL
 *   createdAt   TIMESTAMPTZ
 *   updatedAt   TIMESTAMPTZ
 */

const { DataTypes, Model } = require('sequelize');
const sequelize            = require('../config/database');

class Message extends Model {}

Message.init(
  {
    id: {
      type:          DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey:    true,
    },

    body: {
      type:      DataTypes.TEXT,
      allowNull: false,
      validate: {
        notEmpty: { msg: 'Message body cannot be blank.' },
      },
    },

    threadId: {
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
    modelName:  'Message',
    tableName:  'messages',
    timestamps: true,
  }
);

module.exports = Message;
