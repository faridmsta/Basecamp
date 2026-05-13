'use strict';

/**
 * routes/sessions.js
 *
 * GET    /sessions/sign_in   → sessions#signInForm
 * POST   /sessions/sign_in   → sessions#signIn
 * DELETE /sessions/sign_out  → sessions#signOut
 */

const express      = require('express');
const router       = express.Router();
const sessionsCtrl = require('../controllers/sessionsController');
const { redirectIfLoggedIn } = require('../middleware/auth');

router.get('/sign_in',    redirectIfLoggedIn, sessionsCtrl.signInForm);
router.post('/sign_in',   redirectIfLoggedIn, sessionsCtrl.signIn);
router.delete('/sign_out',                    sessionsCtrl.signOut);

module.exports = router;
