'use strict';

/**
 * routes/admin.js
 *
 * All routes require: requireLogin + requireAdmin
 *
 * GET   /admin/users                    → roles#index
 * PATCH /admin/users/:id/set_admin      → roles#setAdmin
 * PATCH /admin/users/:id/remove_admin   → roles#removeAdmin
 * DELETE /admin/users/:id               → users#destroy (via admin)
 */

const express    = require('express');
const router     = express.Router();
const rolesCtrl  = require('../controllers/rolesController');
const usersCtrl  = require('../controllers/usersController');
const { requireLogin, requireAdmin } = require('../middleware/auth');

// Guard entire admin namespace
router.use(requireLogin, requireAdmin);

router.get('/users',                   rolesCtrl.index);
router.get('/users/new',               usersCtrl.adminNewUser);
router.post('/users',                  usersCtrl.adminCreateUser);
router.patch('/users/:id/set_admin',   rolesCtrl.setAdmin);
router.patch('/users/:id/remove_admin',rolesCtrl.removeAdmin);
router.delete('/users/:id',            usersCtrl.destroyUser);

module.exports = router;
