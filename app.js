'use strict';

require('dotenv').config();
const express = require('express');
const path = require('path');
const session = require('express-session');
const flash = require('connect-flash');
const methodOverride = require('method-override');

const ejsLayouts = require('express-ejs-layouts');
const { sequelize } = require('./models');
const routes = require('./routes');

const app = express();

// ─── View Engine ──────────────────────────────────────────────
app.use(ejsLayouts);
app.set('view engine', 'ejs');
app.set('layout', 'layouts/main');
app.set('views', path.join(__dirname, 'views'));

// ─── Static Assets ────────────────────────────────────────────
app.use(express.static(path.join(__dirname, 'public')));
// Serve uploaded files at /uploads/<filename>
app.use('/uploads', express.static(path.join(__dirname, 'public', 'uploads')));

// ─── Body Parsers ─────────────────────────────────────────────
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// ─── Method Override (PUT / DELETE via forms) ─────────────────
app.use(methodOverride('_method'));

// ─── Session ──────────────────────────────────────────────────
app.use(session({
  secret: process.env.SESSION_SECRET || 'fallback_secret',
  resave: false,
  saveUninitialized: false,
  cookie: { secure: false, maxAge: 1000 * 60 * 60 * 24 }, // 24 h
}));

// ─── Flash Messages ───────────────────────────────────────────
app.use(flash());

// ─── Global Template Locals ───────────────────────────────────
app.use((req, res, next) => {
  res.locals.currentUser = req.session.userId ? { id: req.session.userId, role: req.session.role } : null;
  res.locals.successMessages = req.flash('success');
  res.locals.errorMessages = req.flash('error');
  next();
});

// ─── Routes ───────────────────────────────────────────────────
app.use('/', routes);

// ─── 404 Handler ──────────────────────────────────────────────
app.use((req, res) => {
  res.status(404).render('errors/404', { title: 'Page Not Found' });
});

// ─── Global Error Handler ─────────────────────────────────────
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).render('errors/500', { title: 'Server Error', message: err.message });
});

// ─── Database Sync & Server Start ─────────────────────────────
const PORT = process.env.PORT || 3000;

sequelize.authenticate()
  .then(() => {
    console.log('✅  PostgreSQL connected');
    return sequelize.sync({ alter: true });
  })
  .then(() => {
    app.listen(PORT, () => console.log(`🚀  Project Manager Application running on http://localhost:${PORT}`));
  })
  .catch(err => {
    console.error('❌  Database connection failed:', err.message);
    process.exit(1);
  });

module.exports = app;
