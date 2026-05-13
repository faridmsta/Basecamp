'use strict';

/**
 * controllers/projectsController.js
 *
 * Actions:
 *   #index   GET    /projects          — Dashboard: list all projects
 *   #new     GET    /projects/new      — New project form
 *   #create  POST   /projects          — Process creation
 *   #show    GET    /projects/:id      — View single project
 *   #edit    GET    /projects/:id/edit — Edit form
 *   #update  PUT    /projects/:id      — Process update
 *   #destroy DELETE /projects/:id      — Delete project
 */

const { Project, User, Attachment, Thread, Message } = require('../models');

// ── GET /projects ─────────────────────────────────────────────
const index = async (req, res, next) => {
  try {
    // Admins see all projects; regular users see only their own
    const where = req.session.role === 'admin' ? {} : { userId: req.session.userId };

    const projects = await Project.findAll({
      where,
      include: [{ model: User, as: 'owner', attributes: ['id', 'username'] }],
      order:   [['createdAt', 'DESC']],
    });

    res.render('projects/index', { title: 'My Projects', projects });
  } catch (err) {
    next(err);
  }
};

// ── GET /projects/new ─────────────────────────────────────────
const newProject = (req, res) => {
  res.render('projects/new', { title: 'New Project', errors: [] });
};

// ── POST /projects ────────────────────────────────────────────
const createProject = async (req, res, next) => {
  const { name, description, status } = req.body;

  try {
    const project = await Project.create({
      name,
      description,
      status: status || 'active',
      userId: req.session.userId,
    });

    req.flash('success', `Project "${project.name}" created successfully!`);
    res.redirect(`/projects/${project.id}`);
  } catch (err) {
    const errors = err.errors
      ? err.errors.map(e => ({ message: e.message }))
      : [{ message: err.message }];

    res.render('projects/new', { title: 'New Project', errors });
  }
};

// ── GET /projects/:id ─────────────────────────────────────────
const showProject = async (req, res, next) => {
  try {
    const project = await Project.findByPk(req.params.id, {
      include: [
        { model: User, as: 'owner', attributes: ['id', 'username'] },
        {
          model:   Attachment,
          as:      'attachments',
          include: [{ model: User, as: 'uploader', attributes: ['id', 'username'] }],
          order:   [['createdAt', 'DESC']],
        },
        {
          model:   Thread,
          as:      'threads',
          include: [
            { model: User,    as: 'creator',  attributes: ['id', 'username'] },
            { model: Message, as: 'messages', attributes: ['id'] },
          ],
          order:   [['createdAt', 'DESC']],
        },
      ],
    });

    if (!project) {
      req.flash('error', 'Project not found.');
      return res.redirect('/projects');
    }

    // Non-admins can only view their own projects
    if (project.userId !== req.session.userId && req.session.role !== 'admin') {
      req.flash('error', 'You do not have access to that project.');
      return res.redirect('/projects');
    }

    const isProjectAdmin =
      req.session.role === 'admin' || project.userId === req.session.userId;

    res.render('projects/show', { title: project.name, project, isProjectAdmin });
  } catch (err) {
    next(err);
  }
};

// ── GET /projects/:id/edit ────────────────────────────────────
const editProject = async (req, res, next) => {
  try {
    // req.project is attached by requireOwnerOrAdmin middleware
    res.render('projects/edit', { title: `Edit — ${req.project.name}`, project: req.project, errors: [] });
  } catch (err) {
    next(err);
  }
};

// ── PUT /projects/:id ─────────────────────────────────────────
const updateProject = async (req, res, next) => {
  const { name, description, status } = req.body;

  try {
    await req.project.update({ name, description, status });

    req.flash('success', `Project "${req.project.name}" updated successfully.`);
    res.redirect(`/projects/${req.project.id}`);
  } catch (err) {
    const errors = err.errors
      ? err.errors.map(e => ({ message: e.message }))
      : [{ message: err.message }];

    res.render('projects/edit', {
      title:   `Edit — ${req.project.name}`,
      project: req.project,
      errors,
    });
  }
};

// ── DELETE /projects/:id ──────────────────────────────────────
const destroyProject = async (req, res, next) => {
  try {
    const name = req.project.name;
    await req.project.destroy();

    req.flash('success', `Project "${name}" has been deleted.`);
    res.redirect('/projects');
  } catch (err) {
    next(err);
  }
};

module.exports = { index, newProject, createProject, showProject, editProject, updateProject, destroyProject };
