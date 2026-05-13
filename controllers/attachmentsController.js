'use strict';

/**
 * controllers/attachmentsController.js
 *
 * Actions:
 *   #create  POST   /projects/:projectId/attachments
 *   #destroy DELETE /projects/:projectId/attachments/:id
 *
 * Authorization:
 *   Any user associated to the project (member or admin) can create.
 *   Only the uploader or project admin can delete.
 */

const path        = require('path');
const fs          = require('fs');
const { Attachment, Project } = require('../models');

// ── POST /projects/:projectId/attachments ─────────────────────
const create = async (req, res, next) => {
  const { projectId } = req.params;
  try {
    if (!req.file) {
      req.flash('error', 'No file was uploaded or file type is not allowed (PNG, JPG, PDF, TXT only).');
      return res.redirect(`/projects/${projectId}`);
    }

    const ext = path.extname(req.file.originalname).toLowerCase().replace('.', '');

    await Attachment.create({
      filename:   req.file.originalname,
      storedName: req.file.filename,
      format:     ext,
      mimetype:   req.file.mimetype,
      size:       req.file.size,
      projectId:  parseInt(projectId, 10),
      userId:     req.session.userId,
    });

    req.flash('success', `File "${req.file.originalname}" uploaded successfully.`);
    res.redirect(`/projects/${projectId}`);
  } catch (err) {
    next(err);
  }
};

// ── DELETE /projects/:projectId/attachments/:id ───────────────
const destroy = async (req, res, next) => {
  const { projectId, id } = req.params;
  try {
    const attachment = await Attachment.findOne({
      where: { id, projectId },
    });

    if (!attachment) {
      req.flash('error', 'Attachment not found.');
      return res.redirect(`/projects/${projectId}`);
    }

    // Only the uploader or admin can delete
    if (attachment.userId !== req.session.userId && req.session.role !== 'admin') {
      req.flash('error', 'You do not have permission to delete that attachment.');
      return res.redirect(`/projects/${projectId}`);
    }

    // Remove file from disk
    const filePath = path.join(__dirname, '..', 'public', 'uploads', attachment.storedName);
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }

    await attachment.destroy();
    req.flash('success', `Attachment "${attachment.filename}" deleted.`);
    res.redirect(`/projects/${projectId}`);
  } catch (err) {
    next(err);
  }
};

module.exports = { create, destroy };
