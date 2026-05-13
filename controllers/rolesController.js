'use strict';

/**
 * controllers/rolesController.js
 *
 * Actions:
 *   #setAdmin    PATCH /admin/users/:id/set_admin    — Promote user to admin
 *   #removeAdmin PATCH /admin/users/:id/remove_admin — Demote admin to user
 *   #index       GET   /admin/users                  — List all users (admin panel)
 */

const { User, Project } = require('../models');

// ── GET /admin/users ──────────────────────────────────────────
const index = async (req, res, next) => {
  try {
    const users = await User.findAll({ order: [['createdAt', 'DESC']] });
    res.render('admin/users', { title: 'Admin — User Management', users });
  } catch (err) {
    next(err);
  }
};

// ── PATCH /admin/users/:id/set_admin ─────────────────────────
const setAdmin = async (req, res, next) => {
  try {
    const user = await User.findByPk(req.params.id);
    if (!user) {
      req.flash('error', 'User not found.');
      return res.redirect('/admin/users');
    }

    await user.update({ role: 'admin' });
    req.flash('success', `${user.username} is now an Admin.`);
    res.redirect('/admin/users');
  } catch (err) {
    next(err);
  }
};

// ── PATCH /admin/users/:id/remove_admin ──────────────────────
const removeAdmin = async (req, res, next) => {
  try {
    const user = await User.findByPk(req.params.id);
    if (!user) {
      req.flash('error', 'User not found.');
      return res.redirect('/admin/users');
    }

    // Prevent an admin from removing their own admin status
    if (user.id === req.session.userId) {
      req.flash('error', 'You cannot remove your own admin privileges.');
      return res.redirect('/admin/users');
    }

    await user.update({ role: 'user' });
    req.flash('success', `${user.username} has been demoted to User.`);
    res.redirect('/admin/users');
  } catch (err) {
    next(err);
  }
};

module.exports = { index, setAdmin, removeAdmin };
