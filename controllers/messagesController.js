'use strict';

/**
 * controllers/messagesController.js
 *
 * Actions:
 *   #create  POST   /projects/:projectId/threads/:threadId/messages
 *   #edit    GET    /projects/:projectId/threads/:threadId/messages/:id/edit
 *   #update  PUT    /projects/:projectId/threads/:threadId/messages/:id
 *   #destroy DELETE /projects/:projectId/threads/:threadId/messages/:id
 *
 * Authorization:
 *   Any project member can create.
 *   Only the author or admin can edit/delete.
 */

const { Message, Thread } = require('../models');

// ── POST /projects/:projectId/threads/:threadId/messages ──────
const create = async (req, res, next) => {
  const { projectId, threadId } = req.params;
  const { body } = req.body;
  try {
    const thread = await Thread.findOne({ where: { id: threadId, projectId } });
    if (!thread) {
      req.flash('error', 'Thread not found.');
      return res.redirect(`/projects/${projectId}`);
    }

    await Message.create({
      body,
      threadId: parseInt(threadId, 10),
      userId:   req.session.userId,
    });

    req.flash('success', 'Message posted.');
    res.redirect(`/projects/${projectId}/threads/${threadId}`);
  } catch (err) {
    const errors = err.errors
      ? err.errors.map(e => ({ message: e.message }))
      : [{ message: err.message }];
    req.flash('error', errors.map(e => e.message).join(' '));
    res.redirect(`/projects/${projectId}/threads/${threadId}`);
  }
};

// ── GET /projects/:projectId/threads/:threadId/messages/:id/edit
const edit = async (req, res, next) => {
  const { projectId, threadId, id } = req.params;
  try {
    const message = await Message.findOne({ where: { id, threadId } });
    if (!message) {
      req.flash('error', 'Message not found.');
      return res.redirect(`/projects/${projectId}/threads/${threadId}`);
    }

    // Only author or admin
    if (message.userId !== req.session.userId && req.session.role !== 'admin') {
      req.flash('error', 'You cannot edit that message.');
      return res.redirect(`/projects/${projectId}/threads/${threadId}`);
    }

    res.render('messages/edit', {
      title:    'Edit Message',
      message,
      projectId,
      threadId,
      errors:   [],
    });
  } catch (err) {
    next(err);
  }
};

// ── PUT /projects/:projectId/threads/:threadId/messages/:id ───
const update = async (req, res, next) => {
  const { projectId, threadId, id } = req.params;
  const { body } = req.body;
  try {
    const message = await Message.findOne({ where: { id, threadId } });
    if (!message) {
      req.flash('error', 'Message not found.');
      return res.redirect(`/projects/${projectId}/threads/${threadId}`);
    }

    if (message.userId !== req.session.userId && req.session.role !== 'admin') {
      req.flash('error', 'You cannot edit that message.');
      return res.redirect(`/projects/${projectId}/threads/${threadId}`);
    }

    await message.update({ body });
    req.flash('success', 'Message updated.');
    res.redirect(`/projects/${projectId}/threads/${threadId}`);
  } catch (err) {
    const errors = err.errors
      ? err.errors.map(e => ({ message: e.message }))
      : [{ message: err.message }];

    res.render('messages/edit', {
      title:    'Edit Message',
      message:  { id, body, threadId },
      projectId,
      threadId,
      errors,
    });
  }
};

// ── DELETE /projects/:projectId/threads/:threadId/messages/:id
const destroy = async (req, res, next) => {
  const { projectId, threadId, id } = req.params;
  try {
    const message = await Message.findOne({ where: { id, threadId } });
    if (!message) {
      req.flash('error', 'Message not found.');
      return res.redirect(`/projects/${projectId}/threads/${threadId}`);
    }

    if (message.userId !== req.session.userId && req.session.role !== 'admin') {
      req.flash('error', 'You cannot delete that message.');
      return res.redirect(`/projects/${projectId}/threads/${threadId}`);
    }

    await message.destroy();
    req.flash('success', 'Message deleted.');
    res.redirect(`/projects/${projectId}/threads/${threadId}`);
  } catch (err) {
    next(err);
  }
};

module.exports = { create, edit, update, destroy };
