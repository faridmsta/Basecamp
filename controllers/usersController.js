'use strict';

/**
 * controllers/usersController.js
 *
 * Actions:
 *   #new      GET  /users/new       — Registration form
 *   #create   POST /users           — Process registration
 *   #show     GET  /users/:id       — User profile
 *   #destroy  DELETE /users/:id     — Delete account (self or admin)
 */

const { User, Project } = require('../models');

// ── GET /users/new ────────────────────────────────────────────
const newUser = (req, res) => {
  res.render('users/new', { title: 'Create Account', errors: [], layout: 'layouts/auth' });
};

// ── POST /users ───────────────────────────────────────────────
const createUser = async (req, res) => {
  const { username, email, password, password_confirmation } = req.body;

  // Client-side parity check
  if (password !== password_confirmation) {
    return res.render('users/new', {
      title:  'Create Account',
      errors: [{ message: 'Passwords do not match.' }],
      layout: 'layouts/auth',
    });
  }

  try {
    const user = await User.create({ username, email, password, role: 'user' });

    // Auto-login after registration
    req.session.userId = user.id;
    req.session.role   = user.role;

    req.flash('success', `Welcome, ${user.username}! Your account has been created.`);
    res.redirect('/projects');
  } catch (err) {
    // Sequelize validation errors
    const errors = err.errors
      ? err.errors.map(e => ({ message: e.message }))
      : [{ message: err.message }];

    res.render('users/new', { title: 'Create Account', errors, layout: 'layouts/auth' });
  }
};

// ── GET /users/:id ────────────────────────────────────────────
const showUser = async (req, res, next) => {
  try {
    const user = await User.findByPk(req.params.id, {
      include: [{ model: Project, as: 'projects' }],
    });

    if (!user) {
      req.flash('error', 'User not found.');
      return res.redirect('/projects');
    }

    res.render('users/show', { title: `${user.username}'s Profile`, profileUser: user });
  } catch (err) {
    next(err);
  }
};

// ── DELETE /users/:id ─────────────────────────────────────────
const destroyUser = async (req, res, next) => {
  try {
    const target = await User.findByPk(req.params.id);
    if (!target) {
      req.flash('error', 'User not found.');
      return res.redirect('/projects');
    }

    // Only the user themselves or an admin may delete an account
    const isSelf  = req.session.userId === target.id;
    const isAdmin = req.session.role   === 'admin';

    if (!isSelf && !isAdmin) {
      req.flash('error', 'You are not authorized to delete this account.');
      return res.redirect(`/users/${target.id}`);
    }

    await target.destroy();

    // If the user deleted themselves, destroy the session
    if (isSelf) {
      req.session.destroy();
      return res.redirect('/');
    }

    req.flash('success', `Account for "${target.username}" has been deleted.`);
    res.redirect('/admin/users');
  } catch (err) {
    next(err);
  }
};

// ── GET /admin/users/new ──────────────────────────────────────
const adminNewUser = (req, res) => {
  res.render('admin/new_user', { title: 'Admin — Create User', errors: [] });
};

// ── POST /admin/users ─────────────────────────────────────────
const adminCreateUser = async (req, res) => {
  const { username, email, password, password_confirmation, role } = req.body;

  if (password !== password_confirmation) {
    return res.render('admin/new_user', {
      title: 'Admin — Create User',
      errors: [{ message: 'Passwords do not match.' }],
    });
  }

  try {
    const user = await User.create({ username, email, password, role: role || 'user' });
    req.flash('success', `User ${user.username} successfully created.`);
    res.redirect('/admin/users');
  } catch (err) {
    const errors = err.errors ? err.errors.map(e => ({ message: e.message })) : [{ message: err.message }];
    res.render('admin/new_user', { title: 'Admin — Create User', errors });
  }
};

module.exports = { newUser, createUser, showUser, destroyUser, adminNewUser, adminCreateUser };
