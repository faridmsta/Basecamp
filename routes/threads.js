'use strict';

/**
 * routes/threads.js
 *
 * GET    /projects/:projectId/threads/new          → threads#new       (admin)
 * POST   /projects/:projectId/threads              → threads#create    (admin)
 * GET    /projects/:projectId/threads/:id          → threads#show      (any member)
 * GET    /projects/:projectId/threads/:id/edit     → threads#edit      (admin)
 * PUT    /projects/:projectId/threads/:id          → threads#update    (admin)
 * DELETE /projects/:projectId/threads/:id          → threads#destroy   (admin)
 *
 * Messages nested under threads:
 * POST   /projects/:projectId/threads/:threadId/messages              → messages#create
 * GET    /projects/:projectId/threads/:threadId/messages/:id/edit     → messages#edit
 * PUT    /projects/:projectId/threads/:threadId/messages/:id          → messages#update
 * DELETE /projects/:projectId/threads/:threadId/messages/:id          → messages#destroy
 */

const express       = require('express');
const router        = express.Router({ mergeParams: true });
const threadsCtrl   = require('../controllers/threadsController');
const messagesCtrl  = require('../controllers/messagesController');
const {
  requireLogin,
  requireProjectAccess,
  requireProjectAdmin,
  requireThreadAccess,
} = require('../middleware/auth');

router.use(requireLogin);
router.use(requireProjectAccess);

// ── Thread routes ─────────────────────────────────────────────
router.get('/new',        requireProjectAdmin,                      threadsCtrl.newThread);
router.post('/',          requireProjectAdmin,                      threadsCtrl.create);
router.get('/:id',                                                  threadsCtrl.show);
router.get('/:id/edit',   requireProjectAdmin, requireThreadAccess, threadsCtrl.edit);
router.put('/:id',        requireProjectAdmin, requireThreadAccess, threadsCtrl.update);
router.delete('/:id',     requireProjectAdmin, requireThreadAccess, threadsCtrl.destroy);

// ── Message routes (nested under thread) ─────────────────────
router.post('/:threadId/messages',                 messagesCtrl.create);
router.get('/:threadId/messages/:id/edit',         messagesCtrl.edit);
router.put('/:threadId/messages/:id',              messagesCtrl.update);
router.delete('/:threadId/messages/:id',           messagesCtrl.destroy);

module.exports = router;
