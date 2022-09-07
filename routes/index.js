const express = require('express');
const healthCheckRouters = require('./healthcheckRoutes');
const userRoutes = require('./UserRoutes');

const router = express.Router();

router.use(healthCheckRouters);
router.use(userRoutes);

module.exports = router;