const express = require('express');
const healthCheckRoutes = require('./healthcheckRoutes');
const userRoutes = require('./UserRoutes');
const authRoutes = require('./authRoutes');
const testRoutes = require('./testRoutes');

const router = express.Router();

router.use(healthCheckRoutes);
router.use(userRoutes);
router.use(authRoutes);
router.use(testRoutes);

module.exports = router;