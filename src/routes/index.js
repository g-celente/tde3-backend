const express = require('express');
const authRoutes = require('./authRoutes');
const documentRoutes = require('./documentRoutes');
const checklistRoutes = require('./checklistRoutes');
const answerRoutes = require('./answerRoutes');
const nonconformityRoutes = require('./nonconformityRoutes');
const reportRoutes = require('./reportRoutes');
const { authMiddleware } = require('../middlewares/authMiddleware');

const router = express.Router();

// Rotas públicas
router.use('/auth', authRoutes);

// Middleware de autenticação para as rotas protegidas
router.use(authMiddleware);

// Rotas protegidas
router.use('/documents', documentRoutes);
router.use('/checklists', checklistRoutes);
router.use('/answers', answerRoutes);
router.use('/nonconformities', nonconformityRoutes);
router.use('/reports', reportRoutes);

module.exports = router;