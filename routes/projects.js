'use strict';

/**
 * routes/projects.js
 *
 * GET    /projects              → projects#index
 * GET    /projects/new          → projects#new
 * POST   /projects              → projects#create
 * GET    /projects/:id          → projects#show
 * GET    /projects/:id/edit     → projects#edit    (owner or admin)
 * PUT    /projects/:id          → projects#update   (owner or admin)
 * DELETE /projects/:id          → projects#destroy  (owner or admin)
 */

const express      = require('express');
const router       = express.Router();
const projectsCtrl = require('../controllers/projectsController');
const { requireLogin, requireOwnerOrAdmin } = require('../middleware/auth');

// All project routes require authentication
router.use(requireLogin);

router.get('/',        projectsCtrl.index);
router.get('/new',     projectsCtrl.newProject);
router.post('/',       projectsCtrl.createProject);
router.get('/:id',     projectsCtrl.showProject);

// Edit, update, delete require ownership or admin role
router.get('/:id/edit', requireOwnerOrAdmin, projectsCtrl.editProject);
router.put('/:id',      requireOwnerOrAdmin, projectsCtrl.updateProject);
router.delete('/:id',   requireOwnerOrAdmin, projectsCtrl.destroyProject);

module.exports = router;
