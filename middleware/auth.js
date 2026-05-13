'use strict';

/**
 * middleware/auth.js
 * Route-guard middleware for authentication and authorization.
 */

const { User } = require('../models');

/**
 * requireLogin
 * Blocks unauthenticated requests and redirects to /sessions/sign_in.
 */
const requireLogin = (req, res, next) => {
  if (!req.session.userId) {
    req.flash('error', 'You must be logged in to access that page.');
    return res.redirect('/sessions/sign_in');
  }
  next();
};

/**
 * requireAdmin
 * Blocks non-admin users. Must be used AFTER requireLogin.
 */
const requireAdmin = (req, res, next) => {
  if (req.session.role !== 'admin') {
    req.flash('error', 'You do not have permission to perform that action.');
    return res.redirect('/projects');
  }
  next();
};

/**
 * requireOwnerOrAdmin
 * For Project routes — checks that the session user owns the project
 * OR is an admin. Attach the project to req.project after lookup.
 */
const requireOwnerOrAdmin = async (req, res, next) => {
  try {
    const { Project } = require('../models');
    const project = await Project.findByPk(req.params.id);

    if (!project) {
      req.flash('error', 'Project not found.');
      return res.redirect('/projects');
    }

    if (project.userId !== req.session.userId && req.session.role !== 'admin') {
      req.flash('error', 'You do not have permission to modify that project.');
      return res.redirect('/projects');
    }

    req.project = project;
    next();
  } catch (err) {
    next(err);
  }
};

/**
 * requireProjectAccess
 * Used for nested routes (attachments, threads, messages).
 * Loads the project from :projectId and confirms the user is the owner or admin.
 * Attaches req.project for downstream use.
 */
const requireProjectAccess = async (req, res, next) => {
  try {
    const { Project } = require('../models');
    const project = await Project.findByPk(req.params.projectId);

    if (!project) {
      req.flash('error', 'Project not found.');
      return res.redirect('/projects');
    }

    // Non-admins can only access their own projects
    if (project.userId !== req.session.userId && req.session.role !== 'admin') {
      req.flash('error', 'You do not have access to that project.');
      return res.redirect('/projects');
    }

    req.project = project;
    next();
  } catch (err) {
    next(err);
  }
};

/**
 * requireProjectAdmin
 * Confirms the current user is the PROJECT owner or a global admin.
 * Must be used AFTER requireProjectAccess (so req.project is set).
 */
const requireProjectAdmin = (req, res, next) => {
  const { project } = req;
  if (!project) {
    req.flash('error', 'Project not found.');
    return res.redirect('/projects');
  }
  if (project.userId !== req.session.userId && req.session.role !== 'admin') {
    req.flash('error', 'Only the project admin can perform this action.');
    return res.redirect(`/projects/${project.id}`);
  }
  next();
};

/**
 * requireThreadAccess
 * Loads the thread from :id (within :projectId).
 * Attaches req.thread. Used before edit / update / destroy.
 */
const requireThreadAccess = async (req, res, next) => {
  try {
    const { Thread } = require('../models');
    const thread = await Thread.findOne({
      where: { id: req.params.id, projectId: req.params.projectId },
    });

    if (!thread) {
      req.flash('error', 'Thread not found.');
      return res.redirect(`/projects/${req.params.projectId}`);
    }

    req.thread = thread;
    next();
  } catch (err) {
    next(err);
  }
};

/**
 * redirectIfLoggedIn
 * Sends already-authenticated users away from login/register pages.
 */
const redirectIfLoggedIn = (req, res, next) => {
  if (req.session.userId) {
    return res.redirect('/projects');
  }
  next();
};

module.exports = {
  requireLogin,
  requireAdmin,
  requireOwnerOrAdmin,
  requireProjectAccess,
  requireProjectAdmin,
  requireThreadAccess,
  redirectIfLoggedIn,
};
