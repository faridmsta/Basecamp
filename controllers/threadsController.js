'use strict';

/**
 * controllers/threadsController.js
 *
 * Actions:
 *   #new     GET    /projects/:projectId/threads/new
 *   #create  POST   /projects/:projectId/threads
 *   #show    GET    /projects/:projectId/threads/:id
 *   #edit    GET    /projects/:projectId/threads/:id/edit
 *   #update  PUT    /projects/:projectId/threads/:id
 *   #destroy DELETE /projects/:projectId/threads/:id
 *
 * Authorization:
 *   Only project admin (userId === project.userId || role === 'admin') can
 *   create, edit, update, destroy threads.
 */

const { Thread, Project, User, Message } = require('../models');

// ── GET /projects/:projectId/threads/new ─────────────────────
const newThread = async (req, res, next) => {
  try {
    res.render('threads/new', {
      title:     'New Thread',
      projectId: req.params.projectId,
      project:   req.project,
      errors:    [],
    });
  } catch (err) {
    next(err);
  }
};

// ── POST /projects/:projectId/threads ─────────────────────────
const create = async (req, res, next) => {
  const { projectId } = req.params;
  const { title } = req.body;
  try {
    const thread = await Thread.create({
      title,
      projectId: parseInt(projectId, 10),
      userId:    req.session.userId,
    });

    req.flash('success', `Thread "${thread.title}" created.`);
    res.redirect(`/projects/${projectId}/threads/${thread.id}`);
  } catch (err) {
    const errors = err.errors
      ? err.errors.map(e => ({ message: e.message }))
      : [{ message: err.message }];

    res.render('threads/new', {
      title:     'New Thread',
      projectId,
      project:   req.project,
      errors,
    });
  }
};

// ── GET /projects/:projectId/threads/:id ──────────────────────
const show = async (req, res, next) => {
  const { projectId, id } = req.params;
  try {
    const thread = await Thread.findOne({
      where:   { id, projectId },
      include: [
        { model: User,    as: 'creator', attributes: ['id', 'username'] },
        {
          model:   Message,
          as:      'messages',
          include: [{ model: User, as: 'author', attributes: ['id', 'username'] }],
          order:   [['createdAt', 'ASC']],
        },
      ],
    });

    if (!thread) {
      req.flash('error', 'Thread not found.');
      return res.redirect(`/projects/${projectId}`);
    }

    const project = req.project;
    const isProjectAdmin =
      req.session.role === 'admin' || project.userId === req.session.userId;

    res.render('threads/show', {
      title:          thread.title,
      thread,
      project,
      projectId,
      isProjectAdmin,
      errors:         [],
    });
  } catch (err) {
    next(err);
  }
};

// ── GET /projects/:projectId/threads/:id/edit ─────────────────
const edit = async (req, res, next) => {
  try {
    res.render('threads/edit', {
      title:     `Edit Thread — ${req.thread.title}`,
      thread:    req.thread,
      project:   req.project,
      projectId: req.params.projectId,
      errors:    [],
    });
  } catch (err) {
    next(err);
  }
};

// ── PUT /projects/:projectId/threads/:id ──────────────────────
const update = async (req, res, next) => {
  const { projectId } = req.params;
  const { title } = req.body;
  try {
    await req.thread.update({ title });
    req.flash('success', `Thread "${req.thread.title}" updated.`);
    res.redirect(`/projects/${projectId}/threads/${req.thread.id}`);
  } catch (err) {
    const errors = err.errors
      ? err.errors.map(e => ({ message: e.message }))
      : [{ message: err.message }];

    res.render('threads/edit', {
      title:     `Edit Thread — ${req.thread.title}`,
      thread:    req.thread,
      project:   req.project,
      projectId,
      errors,
    });
  }
};

// ── DELETE /projects/:projectId/threads/:id ───────────────────
const destroy = async (req, res, next) => {
  const { projectId } = req.params;
  try {
    const name = req.thread.title;
    await req.thread.destroy();
    req.flash('success', `Thread "${name}" deleted.`);
    res.redirect(`/projects/${projectId}`);
  } catch (err) {
    next(err);
  }
};

module.exports = { newThread, create, show, edit, update, destroy };
