'use strict';

/**
 * routes/users.js
 *
 * GET    /users/new    → users#new
 * POST   /users        → users#create
 * GET    /users/:id    → users#show     (must be logged in)
 * DELETE /users/:id    → users#destroy  (self or admin)
 */

const express        = require('express');
const router         = express.Router();
const usersCtrl      = require('../controllers/usersController');
const { requireLogin, redirectIfLoggedIn } = require('../middleware/auth');

router.get('/new',    redirectIfLoggedIn, usersCtrl.newUser);
router.post('/',      redirectIfLoggedIn, usersCtrl.createUser);
router.get('/:id',    requireLogin,       usersCtrl.showUser);
router.delete('/:id', requireLogin,       usersCtrl.destroyUser);

module.exports = router;
