'use strict';

/**
 * routes/index.js
 * Master router — mounts all sub-routers.
 */

const express         = require('express');
const router          = express.Router();

const userRoutes       = require('./users');
const sessionRoutes    = require('./sessions');
const projectRoutes    = require('./projects');
const adminRoutes      = require('./admin');
const attachmentRoutes = require('./attachments');
const threadRoutes     = require('./threads');

// ── Home redirect ──────────────────────────────────────────────
router.get('/', (req, res) => {
  if (req.session.userId) return res.redirect('/projects');
  res.redirect('/sessions/sign_in');
});

// ── Mount sub-routers ─────────────────────────────────────────
router.use('/users',    userRoutes);
router.use('/sessions', sessionRoutes);
router.use('/projects', projectRoutes);
router.use('/admin',    adminRoutes);

// ── Nested: attachments & threads under a project ─────────────
router.use('/projects/:projectId/attachments', attachmentRoutes);
router.use('/projects/:projectId/threads',     threadRoutes);

module.exports = router;
