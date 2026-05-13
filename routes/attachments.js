'use strict';

/**
 * routes/attachments.js
 *
 * POST   /projects/:projectId/attachments          → attachments#create
 * DELETE /projects/:projectId/attachments/:id      → attachments#destroy
 */

const express           = require('express');
const router            = express.Router({ mergeParams: true });
const attachmentsCtrl   = require('../controllers/attachmentsController');
const upload            = require('../config/upload');
const { requireLogin, requireProjectAccess } = require('../middleware/auth');

router.use(requireLogin);
router.use(requireProjectAccess);

router.post('/',    upload.single('attachment'), attachmentsCtrl.create);
router.delete('/:id', attachmentsCtrl.destroy);

module.exports = router;
