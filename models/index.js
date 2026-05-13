'use strict';

/**
 * models/index.js
 * Bootstraps all Sequelize models and registers associations.
 */

const sequelize  = require('../config/database');
const User       = require('./User');
const Project    = require('./Project');
const Attachment = require('./Attachment');
const Thread     = require('./Thread');
const Message    = require('./Message');

// ─── Project ↔ User ───────────────────────────────────────────
User.hasMany(Project, { foreignKey: 'userId', as: 'projects', onDelete: 'CASCADE' });
Project.belongsTo(User, { foreignKey: 'userId', as: 'owner' });

// ─── Attachment ↔ Project ─────────────────────────────────────
Project.hasMany(Attachment, { foreignKey: 'projectId', as: 'attachments', onDelete: 'CASCADE' });
Attachment.belongsTo(Project, { foreignKey: 'projectId', as: 'project' });

// ─── Attachment ↔ User ────────────────────────────────────────
User.hasMany(Attachment, { foreignKey: 'userId', as: 'attachments', onDelete: 'SET NULL' });
Attachment.belongsTo(User, { foreignKey: 'userId', as: 'uploader' });

// ─── Thread ↔ Project ─────────────────────────────────────────
Project.hasMany(Thread, { foreignKey: 'projectId', as: 'threads', onDelete: 'CASCADE' });
Thread.belongsTo(Project, { foreignKey: 'projectId', as: 'project' });

// ─── Thread ↔ User (creator) ──────────────────────────────────
User.hasMany(Thread, { foreignKey: 'userId', as: 'threads', onDelete: 'SET NULL' });
Thread.belongsTo(User, { foreignKey: 'userId', as: 'creator' });

// ─── Message ↔ Thread ─────────────────────────────────────────
Thread.hasMany(Message, { foreignKey: 'threadId', as: 'messages', onDelete: 'CASCADE' });
Message.belongsTo(Thread, { foreignKey: 'threadId', as: 'thread' });

// ─── Message ↔ User ───────────────────────────────────────────
User.hasMany(Message, { foreignKey: 'userId', as: 'messages', onDelete: 'SET NULL' });
Message.belongsTo(User, { foreignKey: 'userId', as: 'author' });

module.exports = { sequelize, User, Project, Attachment, Thread, Message };
