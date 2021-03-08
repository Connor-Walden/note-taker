const router = require('express').Router();
const noteRoutes = require('./noteRoutes');
router.use('/notes', noteRoutes);
module.exports = router;
