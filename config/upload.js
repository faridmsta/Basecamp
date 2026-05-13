'use strict';

/**
 * config/upload.js
 * Multer configuration for project attachments.
 * Allowed: png, jpg, jpeg, pdf, txt
 * Max size: 10 MB
 */

const multer = require('multer');
const path   = require('path');
const crypto = require('crypto');
const fs     = require('fs');

const UPLOAD_DIR = path.join(__dirname, '..', 'public', 'uploads');

// Ensure upload directory exists
if (!fs.existsSync(UPLOAD_DIR)) {
  fs.mkdirSync(UPLOAD_DIR, { recursive: true });
}

const ALLOWED_EXTENSIONS = new Set(['.png', '.jpg', '.jpeg', '.pdf', '.txt']);
const ALLOWED_MIMETYPES  = new Set([
  'image/png', 'image/jpeg', 'application/pdf', 'text/plain',
]);

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, UPLOAD_DIR),

  filename: (_req, file, cb) => {
    const ext      = path.extname(file.originalname).toLowerCase();
    const unique   = crypto.randomBytes(16).toString('hex');
    cb(null, `${unique}${ext}`);
  },
});

const fileFilter = (_req, file, cb) => {
  const ext = path.extname(file.originalname).toLowerCase();
  if (ALLOWED_EXTENSIONS.has(ext) && ALLOWED_MIMETYPES.has(file.mimetype)) {
    return cb(null, true);
  }
  cb(new Error('Only PNG, JPG, PDF, and TXT files are allowed.'), false);
};

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10 MB
});

module.exports = upload;
