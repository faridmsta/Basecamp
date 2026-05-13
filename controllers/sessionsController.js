'use strict';

/**
 * controllers/sessionsController.js
 *
 * Actions:
 *   #sign_in  GET  /sessions/sign_in  — Login form
 *   #sign_in  POST /sessions/sign_in  — Process login
 *   #sign_out DELETE /sessions/sign_out — Logout
 */

const { User } = require('../models');

// ── GET /sessions/sign_in ─────────────────────────────────────
const signInForm = (req, res) => {
  res.render('sessions/sign_in', { title: 'Sign In', errors: [], layout: 'layouts/auth' });
};

// ── POST /sessions/sign_in ────────────────────────────────────
const signIn = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Use the 'withPassword' scope to include the hashed password column
    const user = await User.scope('withPassword').findOne({ where: { email } });

    if (!user || !(await user.verifyPassword(password))) {
      return res.render('sessions/sign_in', {
        title:  'Sign In',
        errors: [{ message: 'Invalid email or password.' }],
        layout: 'layouts/auth',
      });
    }

    // Persist minimal session data — never store the full user object
    req.session.userId = user.id;
    req.session.role   = user.role;

    req.flash('success', `Welcome back, ${user.username}!`);
    res.redirect('/projects');
  } catch (err) {
    res.render('sessions/sign_in', {
      title:  'Sign In',
      errors: [{ message: 'An unexpected error occurred. Please try again.' }],
      layout: 'layouts/auth',
    });
  }
};

// ── DELETE /sessions/sign_out ─────────────────────────────────
const signOut = (req, res) => {
  req.session.destroy(err => {
    if (err) console.error('Session destroy error:', err);
    res.redirect('/sessions/sign_in');
  });
};

module.exports = { signInForm, signIn, signOut };
